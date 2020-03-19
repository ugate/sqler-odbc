'use strict';

// TODO : ESM comment the following lines...
const { Labrat, LOGGER } = require('@ugate/labrat');
const { Manager } = require('sqler');
const Path = require('path');
const Fs = require('fs');
const Os = require('os');
const { expect } = require('@hapi/code');
// TODO : import { Labrat, LOGGER } from '@ugate/labrat';
// TODO : import { Manager } from 'sqler.mjs';
// TODO : import * as Fs from 'fs';
// TODO : import * as Os from 'os';
// TODO : import { expect } from '@hapi/code';

const priv = {
  mgr: null,
  cache: null,
  rowCount: 2,
  mgrLogit: !!LOGGER.info,
  dialect: 'mssql', // change the dialect to run `node test/lib/main.js crud` for different DBs
  conf: {}
};

// TODO : ESM uncomment the following line...
// export
class Tester {

  /**
   * Create table(s) used for testing
   */
  static async before() {
    priv.ci = 'CI' in process.env;
    Labrat.header(`Creating test tables (if any)${priv.ci ? ` CI=${priv.ci}` : ''}`);
    
    const conf = getConf();
    priv.cache = null;
    priv.mgr = new Manager(conf, priv.cache, priv.mgrLogit);
    await priv.mgr.init();
    
    if (priv.mgr.db[priv.dialect].setup) {
      const create = getCrudOp('create', priv.dialect, true);
      await create(priv.mgr, priv.dialect);
    }
    priv.created = true;
  }

  /**
   * Drop table(s) used for testing
   */
  static async after() {
    if (!priv.created) {
      Labrat.header('Skipping dropping of test tables');
      return;
    }
    Labrat.header('Dropping test tables (if any)');
    
    const conf = getConf();
    priv.cache = null;
    if (!priv.mgr) {
      priv.mgr = new Manager(conf, priv.cache, priv.mgrLogit);
      await priv.mgr.init();
    }
    
    if (priv.ci) { // drop isn't really need in CI env
      try {
        if (priv.mgr.db[priv.dialect].setup) {
          const drop = getCrudOp('delete', priv.dialect, true);
          await drop(priv.mgr, priv.dialect);
        }
        priv.created = false;
      } catch (err) {
        if (LOGGER.warn) LOGGER.warn(`Failed to delete tables (CI=${priv.ci})`, err);
      }
    } else {
      await priv.mgr.db[priv.dialect].setup.delete.tables();
      priv.created = false;
    }

  }

  /**
   * Start cache (if present)
   */
  static async beforeEach() {
    const cch = priv.cache;
    priv.cache = null;
    if (cch && cch.start) await cch.start();
  }

  /**
   * Stop cache (if present)
   */
  static async afterEach() {
    const cch = priv.cache;
    priv.cache = null;
    if (cch && cch.stop) await cch.stop();
  }

  //======================== Executions ========================

  /**
   * Test CRUD operations for a specified `priv.dialect` and `priv.mgr`
   */
  static async crud() {
    const rslts = new Array(3);
    let rslti = -1, lastUpdate;

    // expect CRUD results
    const crudly = (rslt, label, nameIncl, count = 2) => {
      if (!rslt.rows) return;
      expect(rslt.rows, `CRUD ${label} rows`).array();
      if (!label.includes('read')) return;
      expect(rslt.rows, `CRUD ${label} rows.length`).length(count);
      let updated;
      for (let row of rslt.rows) {
        expect(row, `CRUD ${label} row`).object();
        if (nameIncl) expect(row.name, `CRUD ${label} row.name`).includes(nameIncl);
        updated = new Date(row.updated) || row.updated;
        expect(updated, `CRUD ${label} row.updated`).date();
        if (lastUpdate) expect(updated, `CRUD ${label} row.updated > lastUpdated`).greaterThan(lastUpdate);
        // TODO : expect for binary report?
        // write the report(s) to file?
        // let report, fpth;
        // for (let row of rslt.rows) {
        //   report = row.report;
        //   if (report) {
        //     // SQL Server stores varbinary as hexadecimal of base64 encoded images
        //     //report = Buffer.from(Buffer.from(report).toString('utf8')).toString('base64');
        //     fpth = `${Os.tmpdir()}/sqler-odbc-${connName}-read-${row.id}.png`;
        //     await Fs.promises.writeFile(fpth, report);
        //   }
        // }
      }
      lastUpdate = updated;
    };

    const create = getCrudOp('create', priv.dialect);
    rslts[++rslti] = await create(priv.mgr, priv.dialect);
    crudly(rslts[rslti], 'create');

    const read = getCrudOp('read', priv.dialect);
    rslts[++rslti] = await read(priv.mgr, priv.dialect);
    crudly(rslts[rslti], 'read', 'TABLE');

    const update = getCrudOp('update', priv.dialect);
    rslts[++rslti] = await update(priv.mgr, priv.dialect);
    crudly(rslts[rslti], 'update');

    rslts[++rslti] = await read(priv.mgr, priv.dialect);
    crudly(rslts[rslti], 'update read', 'UPDATE');

    const del = getCrudOp('delete', priv.dialect);
    rslts[++rslti] = await del(priv.mgr, priv.dialect);
    crudly(rslts[rslti], 'delete');

    rslts[++rslti] = await read(priv.mgr, priv.dialect);
    crudly(rslts[rslti], 'delete read', null, 0);

    if (LOGGER.debug) LOGGER.debug(`CRUD ${priv.dialect} execution results:`, ...rslts);
    return rslts;
  }
}

// TODO : ESM comment the following line...
module.exports = Tester;

/**
 * Generates a configuration
 * @param {Boolean} noPool Truthy to exclude connection pooling
 * @returns {Object} The configuration
 */
function getConf(noPool) {
  let conf = priv.conf[priv.dialect];
  if (!conf) {
    conf = priv.conf[priv.dialect] = JSON.parse(Fs.readFileSync(Path.join(`test/fixtures/${priv.dialect}`, `${priv.dialect}.json`), 'utf8'));
    if (!priv.univ) {
      priv.univ = JSON.parse(Fs.readFileSync(Path.join('test/fixtures', 'priv.json'), 'utf8')).univ;
    }
    conf.univ = priv.univ;
    conf.mainPath = 'test';
    conf.db.dialects.odbc = './index.js';//'./test/dialects/test-dialect.js';
  }
  if (noPool) conf = JSON.parse(JSON.stringify(conf));
  for (let conn of conf.db.connections) {
    if (noPool) {
      delete conn.pool;
    } else {
      conn.pool.min = Math.floor((process.env.UV_THREADPOOL_SIZE - 1) / 2) || 2;
      conn.pool.max = process.env.UV_THREADPOOL_SIZE - 1;
      conn.pool.increment = 1;
    }
  }
  return conf;
}

/**
 * Gets the `async function` that will execute a CRUD operation
 * @param {String} name The name of the CRUD operation (e.g. `create`, `read`, etc.)
 * @param {String} dialect The dialect to use (e.g. `oracle`, `mssql`, etc.)
 * @param {Boolean} [isSetup] Truty when the CRUD operation is for a setup operation (e.g. creating/dropping tables)
 * @returns {Function} The `async function(manager)` that will return the CRUD ODBC results
 */
function getCrudOp(name, dialect, isSetup) {
  const base = Path.join(process.cwd(), `test/lib/${dialect}${isSetup ? '/setup' : ''}`);
  const pth = Path.join(base, `${name}.${isSetup ? 'tables' : 'table.rows'}.js`);
  return require(pth);
}

/**
 * Generate a test logger that just consumes logging
 * @param {Sring[]} [tags] The tags that will prefix the log output
 */
function generateTestAbyssLogger() {
  return function testAbyssLogger() {};
}

// when not ran in a test runner execute static Tester functions (excluding what's passed into Main.run) 
if (!Labrat.usingTestRunner()) {
  (async () => await Labrat.run(Tester))();
}