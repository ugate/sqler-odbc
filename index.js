'use strict';

/**
 * ODBC specific extension of the {@link Manager~ConnectionOptions} from the [`sqler`](https://ugate.github.io/sqler/) module.
 * @typedef {Manager~ConnectionOptions} OdbcConnectionOptions
 * @property {Object} [driverOptions] The `odbc` module specific options.
 * @property {Object} [driverOptions.connection] An object that will contain properties/values that will be used to construct the ODBC connection string.
 * For example, `{ UID: 'someUsername', PWD: 'somePassword' }` would generate `UID=someUsername;PWD=somePassword`.
 * __Any {@link Manager~PrivateOptions} used will override the `driverOptions.connection` properties/values
 * (e.g. `priv = { username: 'someUser', password: 'somePwd' }` would override `driverOptions.connection = { UID: 'ignoreUser', PWD: 'ignorePwd' }`).
 * Likewise, `options.service = 'MyDSN'` will override `driverOptions.connection.DSN = 'IgnoreDSN'`.__
 * When a value is a string surrounded by `${}`, it will be assumed to be a _constant_ property that resides on the `odbc` module and will be interpolated
 * accordingly.
 * For example `driverOptions.connection.someProp = '${ODBC_CONSTANT}'` will be interpolated as `driverOptions.connection.someProp = odbc.ODBC_CONSTANT`.
 * @property {Object} [driverOptions.pool] The pool `conf` options that will be passed into `odbc.pool(conf)`.
 * __Using any of the generic `pool.someOption` will override the `conf` options set on `driverOptions.pool`.__
 * When a value is a string surrounded by `${}`, it will be assumed to be a _constant_ property that resides on the `odbc` module and will be interpolated
 * accordingly.
 * For example `driverOptions.pool.someProp = '${ODBC_CONSTANT}'` will be interpolated as `pool.someProp = odbc.ODBC_CONSTANT`.
 */

/**
 * ODBC specific extension of the {@link Manager~ExecOptions} from the [`sqler`](https://ugate.github.io/sqler/) module. When a property of `binds` contains
 * an object it will be _interpolated_ for property values on the `odbc` module.
 * For example, `binds.name = '${ODBC_CONSTANT}'` will be interpolated as
 * `binds.name = odbc.ODBC_CONSTANT`.
 * @typedef {Manager~ExecOptions} OdbcExecOptions
 * @property {Object} [driverOptions] The `odbc` module specific options.
 * @property {Object} [driverOptions.exec] The options passed into various `odbc` functions during {@link Manager.exec}.
 * When a value is a string surrounded by `${}`, it will be assumed to be a _constant_ property that resides on the `odbc` module and will be interpolated
 * accordingly.
 * For example `driverOptions.exec.isolationLevel = '${SQL_TXN_READ_UNCOMMITTED}'` will be interpolated as
 * `driverOptions.exec.isolationLevel = odbc.SQL_TXN_READ_UNCOMMITTED`.
 * @property {Integer} [driverOptions.exec.isolationLevel] The isolation level to set on the ODBC connection.
 * __Ignored when `opts.type === 'READ'` and  `opts.transactionId` is ommitted.__
 */

/**
 * ODBC {@link Dialect} implementation for [`sqler`](https://ugate.github.io/sqler/)
 */
module.exports = class OdbcDialect {

  /**
   * Constructor
   * @constructs OdbcDialect
   * @param {Manager~PrivateOptions} priv The private configuration options
   * @param {OdbcConnectionOptions} connConf The individual SQL __connection__ configuration for the given dialect that was passed into the originating {@link Manager}
   * @param {Manager~Track} track Container for sharing data between {@link Dialect} instances.
   * @param {Function} [errorLogger] A function that takes one or more arguments and logs the results as an error (similar to `console.error`)
   * @param {Function} [logger] A function that takes one or more arguments and logs the results (similar to `console.log`)
   * @param {Boolean} [debug] A flag that indicates the dialect should be run in debug mode (if supported)
   */
  constructor(priv, connConf, track, errorLogger, logger, debug) {
    const dlt = internal(this);
    dlt.at.track = track;
    dlt.at.odbc = require('odbc');
    dlt.at.connections = {};
    dlt.at.opts = {
      autoCommit: true, // default autoCommit = true to conform to sqler
      id: `sqlerOdbcGen${Math.floor(Math.random() * 10000)}`,
      connection: connConf.driverOptions && connConf.driverOptions.connection ? dlt.at.track.interpolate({}, connConf.driverOptions.connection, dlt.at.odbc) : null,
      pool: connConf.driverOptions && connConf.driverOptions.pool ? dlt.at.track.interpolate({}, connConf.driverOptions.pool, dlt.at.odbc) : {}
    };
    dlt.at.state = {
      pending: 0,
      connection: {}
    };

    dlt.at.opts.pool.connectionString = '';
    const connProp = (name, src, srcName, sensitive) => {
      if (src.hasOwnProperty(srcName)) {
        const append = srcName === 'host' && src.hasOwnProperty('port') ? `:${src.port}` : '';
        dlt.at.opts.connection = dlt.at.opts.connection || {};
        if (dlt.at.logger && dlt.at.opts.connection.hasOwnProperty(name)) {
          dlt.at.logger(`ODBC: Overriding "driverOptions.connection.${name}${
            sensitive ? '' : `=${dlt.at.opts.connection[name]}`}" with configured option value ${
              sensitive ? `named "${srcName}"` : `"${srcName}=${src[srcName]}"` }`);
        }
        dlt.at.opts.connection[name] = `${src[srcName]}${append}`;
      }
    };
    connProp('DSN', connConf, 'service');
    connProp('SERVER', priv, 'host');
    connProp('UID', priv, 'username');
    connProp('PWD', priv, 'password', true);
    if (dlt.at.opts.connection) {
      let cstr = '';
      for (let connProp in dlt.at.opts.connection) {
        cstr += `${cstr ? ';' : ''}${connProp}=${dlt.at.opts.connection[connProp]}`;
      }
      dlt.at.opts.pool.connectionString = cstr;
    }

    dlt.at.errorLogger = errorLogger;
    dlt.at.logger = logger;
    dlt.at.debug = debug;

    dlt.at.opts.pool.initialSize = connConf.pool ? connConf.pool.min : null;
    dlt.at.opts.pool.maxSize = connConf.pool ? connConf.pool.max : null;
    dlt.at.opts.pool.connectionTimeout = connConf.pool ? connConf.pool.idle : null;
    dlt.at.opts.pool.incrementSize = connConf.pool ? connConf.pool.increment : null;
    dlt.at.opts.pool.loginTimeout = connConf.pool ? connConf.pool.timeout : null;
  }

  /**
   * Initializes {@link OdbcDialect} by creating the connection pool
   * @param {Dialect~DialectInitOptions} opts The options described by the `sqler` module
   * @returns {Object} The ODBC connection pool
   */
  async init(opts) {
    const dlt = internal(this), numSql = opts.numOfPreparedStmts;
    let action;
    try {
      if (dlt.at.pool) {
        action = 'captured from cache';
      } else {
        action = 'created';
        dlt.at.pool = await dlt.at.odbc.pool(dlt.at.opts.pool);
      }
      if (dlt.at.logger) {
        dlt.at.logger(`ODBC: Connection pool "${dlt.at.opts.id}" ${action} with (${numSql} SQL files) ` +
          `loginTimeout=${dlt.at.opts.pool.loginTimeout} incrementSize=${dlt.at.opts.pool.incrementSize} ` +
          `initialSize=${dlt.at.opts.pool.initialSize} maxSize=${dlt.at.opts.pool.maxSize} shrink=${dlt.at.opts.pool.shrink}`);
      }
      return dlt.at.pool;
    } catch (err) {
      const msg = `ODBC: connection pool "${dlt.at.opts.id}" could not be ${action}`;
      if (dlt.at.errorLogger) dlt.at.errorLogger(`${msg} ${JSON.stringify(err, null, ' ')}`);
      const pconf = Object.assign({}, dlt.at.opts.pool);
      // mask sensitive data
      if (pconf.PWD) pconf.PWD = '***';
      if (pconf.password) pconf.password = '***';
      err.message = `${err.message}\n${msg} for ${JSON.stringify(pconf, null, ' ')}`;
      err.sqlerOdbc = pconf;
      throw err;
    }
  }

  /**
   * Begins a transaction by opening a connection from the pool
   * @param {String} txId The transaction ID that will be started
   */
  async beginTransaction(txId) {
    const dlt = internal(this);
    if (dlt.at.connections[txId]) return;
    if (dlt.at.logger) {
      dlt.at.logger(`ODBC: Beginning transaction "${txId}" on connection pool "${dlt.at.opts.id}"`);
    }
    dlt.at.connections[txId] = await dlt.this.getConnection({ transactionId: txId });
    try {
      await dlt.at.connections[txId].beginTransaction();
    } catch (err) {
      delete dlt.at.connections[txId];
      throw err;
    }
  }

  /**
   * Executes a SQL statement
   * @param {String} sql the SQL to execute
   * @param {OdbcExecOptions} opts The execution options
   * @param {String[]} frags the frament keys within the SQL that will be retained
   * @returns {Dialect~ExecResults} The execution results
   */
  async exec(sql, opts, frags) {
    const dlt = internal(this);
    let conn, bndp = {}, ebndp = [], esql, rslts;
    try {
      // interpolate and remove unused binds since
      // ODBC only accepts the exact number of bind parameters (also, cuts down on payload bloat)
      bndp = dlt.at.track.interpolate(bndp, opts.binds, dlt.at.odbc, props => sql.includes(`:${props[0]}`));

      // odbc expects binds to be in an array
      esql = sql.replace(/:(\w+)/g, (match, pname) => {
        if (!bndp[pname]) throw new Error(`ODBC: Unbound "${pname}" at position ${ebndp.length}`);
        ebndp.push(bndp[pname]);
        return '?';
      });

      const isQuery = !opts.transactionId && opts.type === 'READ';
      if (isQuery) {
        rslts = await dlt.at.pool.query(esql, ebndp);
      } else {
        conn = await dlt.this.getConnection(opts);
        if (opts.driverOptions && opts.driverOptions.hasOwnProperty('isolationLevel')) {
          await conn.setIsolationLevel(opts.driverOptions.isolationLevel);
        }
        let stmt;
        try {
          stmt = await conn.createStatement();
          await stmt.prepare(esql);
          await stmt.bind(ebndp);
          rslts = await conn.execute();
        } finally {
          if (stmt) await stmt.close();
        }
      }

      const rtn = {
        rows: rslts, // odbc returns an array rather than rslts.rows array
        raw: rslts
      };

      if (!isQuery) {
        if (opts.autoCommit) {
          // ODBC has no option to autocommit during SQL execution
          await operation(dlt, 'commit', true, conn, opts)();
          await operation(dlt, 'close', true, conn, opts)();
        } else {
          dlt.at.state.pending++;
          rtn.commit = operation(dlt, 'commit', true, conn, opts);
          rtn.rollback = operation(dlt, 'rollback', true, conn, opts);
        }
      }
      return rtn;
    } catch (err) {
      if (conn) {
        try {
          conn.close();
        } catch (cerr) {
          err.closeError = cerr;
        }
      }
      const msg = ` (BINDS: ${JSON.stringify(bndp)}, FRAGS: ${frags ? Array.isArray(frags) ? frags.join(', ') : frags : 'N/A'})`;
      if (dlt.at.errorLogger) {
        dlt.at.errorLogger(`Failed to execute the following SQL: ${msg}\n${sql}`, err);
      }
      err.message += msg;
      err.sqlerOdbc = {
        sql: sql,
        odbcSql: esql,
        options: opts,
        binds: bndp,
        odbcBinds: ebndp,
        results: rslts
      };
      throw err;
    }
  }

  /**
   * Gets the currently open connection or a new connection when no transaction is in progress
   * @protected
   * @param {OdbcExecOptions} [opts] The execution options
   * @returns {Object} The connection (when present)
   */
  async getConnection(opts) {
    const dlt = internal(this);
    const txId = opts && opts.transactionId;
    let conn = txId ? dlt.at.connections[txId] : null;
    if (!conn) {
      conn = await dlt.at.pool.connect();
    }
    return conn;
  }

  /**
   * Closes the ODBC connection pool
   * @returns {Integer} The number of connections closed
   */
  async close() {
    const dlt = internal(this);
    try {
      if (dlt.at.logger) {
        dlt.at.logger(`ODBC: Closing connection pool "${dlt.at.opts.id}" (uncommitted transactions: ${dlt.at.state.pending})`);
      }
      if (dlt.at.pool) await dlt.at.pool.close();
      return dlt.at.state.pending;
    } catch (err) {
      if (dlt.at.errorLogger) {
        dlt.at.errorLogger(`ODBC: Failed to close connection pool "${dlt.at.opts.id}" (uncommitted transactions: ${dlt.at.state.pending})`, err);
      }
      throw err;
    }
  }

  /**
   * @returns {Manager~State} The state
   */
  get state() {
    return JSON.parse(JSON.stringify(internal(this).at.state));
  }

  /**
   * @protected
   * @returns {Object} The ODBC driver module
   */
  get driver() {
    return internal(this).at.odbc;
  }
};

/**
 * Executes a function by name that resides on the ODBC connection
 * @private
 * @param {Object} dlt The internal ODBC object instance
 * @param {String} name The name of the function that will be called on the connection
 * @param {Boolean} [reset] Truthy to reset the pending connection and transaction count when the operation completes successfully
 * @param {Object} [conn] The connection (ommit to get a connection from the pool)
 * @param {Manager~ExecOptions} [opts] The {@link Manager~ExecOptions}
 * @returns {Function} A no-arguement `async` function that returns the number or pending transactions
 */
function operation(dlt, name, reset, conn, opts) {
  return async () => {
    let error;
    try {
      if (!conn) {
        conn = await dlt.at.pool.connect();
      }
      if (conn && dlt.at.logger) {
        dlt.at.logger(`ODBC: Performing ${name} on connection pool "${dlt.at.opts.id}" (uncommitted transactions: ${dlt.at.state.pending})`);
      }
      if (conn) await conn[name]();
      if (reset) {
        if (opts && opts.transactionId) delete dlt.at.connections[opts.transactionId];
        dlt.at.state.pending = 0;
      }
    } catch (err) {
      error = err;
      if (dlt.at.errorLogger) {
        dlt.at.errorLogger(`ODBC: Failed to ${name} ${dlt.at.state.pending} transaction(s) with options: ${
          opts ? JSON.stringify(opts) : 'N/A'}`, error);
      }
      throw error;
    } finally {
      if (conn && name !== 'close') {
        try {
          await conn.close();
        } catch (cerr) {
          if (error) {
            error.sqlerOdbc = {
              closeError: cerr
            };
          }
        }
      }
    }
    return dlt.at.state.pending;
  };
}

// private mapping
let map = new WeakMap();
let internal = function(object) {
  if (!map.has(object)) {
    map.set(object, {});
  }
  return {
    at: map.get(object),
    this: object
  };
};