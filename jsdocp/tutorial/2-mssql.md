### 💡 [SQL Server](https://www.microsoft.com/en-us/sql-server/):

> Alternatively, [sqler-mssql](https://www.npmjs.com/package/sqler-mssql) can be used instead of ODBC.

#### Setup:<sub id="setup"></sub>

__Install the [SQL Server ODBC Drivers](https://docs.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server)__

__Windows ODBC Data Source__

![Windows ODBC Data Source 1](./img/odbc-mssql-ds1.jpg "Windows ODBC Data Source 1")

![Windows ODBC Data Source 2](./img/odbc-mssql-ds2.jpg "Windows ODBC Data Source 2")

![Windows ODBC Data Source 3](./img/odbc-mssql-ds3.jpg "Windows ODBC Data Source 3")

![Windows ODBC Data Source 4](./img/odbc-mssql-ds4.jpg "Windows ODBC Data Source 4")

![Windows ODBC Data Source 5](./img/odbc-mssql-ds5.jpg "Windows ODBC Data Source 5")

__UNIX `/etc/odbc.ini` [`unixODBC`](http://www.unixodbc.org/)__
```bash
[ODBC Data Sources]
SqlServerXE=SqlServerXE

[SqlServerXE]
Driver = ODBC Driver SQL Server  
Server = 127.0.0.1
UID = sa
PWD = sqlS3rv35local
```

#### Examples:<sub id="examples"></sub>

The examples below use the following setup:

__[Private Options Configuration:](https://ugate.github.io/sqler/Manager.html#~PrivateOptions)__ (appended to the subsequent connection options)
```jsdocp ./test/conf/priv.json
```

__[Connection Options Configuration:](global.html#OdbcConnectionOptions)__
```jsdocp ./test/conf/mssql.json
```

> __NOTE:__ [`db.connections.driverOptions.connection`](global.html#OdbcConnectionOptions) for `DSN` interpolates into `db.connections[].service` while `UID` and `PWD` interpolate to properties on `univ.db.mssql` set on the private options configuration

```js
// assume conf is set to the forementioned configuration

// see subsequent examples for different examples
const { manager, result } = await runExample(conf);

console.log('Result:', result);

// after we're done using the manager we should close it
process.on('SIGINT', async function sigintDB() {
  await manager.close();
  console.log('Manager has been closed');
});
```

__Create Table:__

```jsdocp ./test/db/mssql/setup/create.tables.sql
-- db/mssql/setup/create.tables.sql
```

__Create Rows:__

```jsdocp ./test/db/mssql/create.rows.sql
-- db/mssql/create.rows.sql
```

```js
async function runExample(conf) {
  const mgr = new Manager(conf);
  // initialize connections and set SQL functions
  await mgr.init();

  // ODBC currently doesn't support Fs.ReadStream/Fs.createReadStream()
  const report = Fs.readFileSync('./test/files/audit-report.pdf', 'utf8');

  // ODBC needs the date to be in a valid ANSI
  // compliant format.
  // Could also use:
  // https://www.npmjs.com/package/moment-db
  const date = new Date().toISOString().replace('T', ' ').replace('Z', '');

  // execute the SQL statement and capture the results
  const rslts = await mgr.db.cache.site.read.lab.departments({
    binds: {
      id: 1, name: 'TEST', created: date, updated: date,
      id2: 1, report2: report, created2: date, updated2: date
    }
  });

  return { manager: mgr, result: rslts };
}
```

__Read Rows:__

```jsdocp ./test/db/mssql/read.test.rows.sql
-- db/mssql/read.test.rows.sql
```

__Delete Table:__

```jsdocp ./test/db/mssql/setup/delete.tables.sql
-- db/mssql/setup/delete.tables.sql
```

#### Working with dates<sub id="dates"></sub>

Due to how data is transpoted via ODBC, dates may need to be bound as ANSI formatted strings such as a UTC format similar to the following:
```js
const bindDate = new Date().toISOString().replace(/([TZ])/g, (match, chr) => (chr === 'T' && ' ') || '');
var offset = new Date().getTimezoneOffset(), o = Math.abs(offset);
    return (offset < 0 ? "+" : "-") + ("00" + Math.floor(o / 60)).slice(-2) + ":" + ("00" + (o % 60)).slice(-2);
// YYYY-MM-DD HH:mm:ss.fff
```

A complete listing of available SQL Server connection string attributes for use on [`options.driverOptions.connection`](global.html#OdbcConnectionOptions) can be found [here](https://docs.microsoft.com/en-us/sql/connect/odbc/dsn-connection-string-attribute).