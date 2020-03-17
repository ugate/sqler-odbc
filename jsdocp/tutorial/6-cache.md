### 💡 [InterSystems Cachè](https://www.intersystems.com/products/cache/):

#### Setup:<sub id="setup"></sub>

__Install the drivers from [ftp.intersystems.com](ftp://ftp.intersystems.com/pub/cache/odbc)__

__Windows ODBC Data Source__

![Windows ODBC Data Source 1](./img/odbc-cache-ds1.jpg "Windows ODBC Data Source 1")

![Windows ODBC Data Source 2](./img/odbc-cache-ds2.jpg "Windows ODBC Data Source 2")

__UNIX `/etc/odbc.ini` [`unixODBC`](http://www.unixodbc.org/)__
```bash
[ODBC Data Sources]
Lab=Lab

[Lab]
Driver=/usr/cachesys/bin/libcacheodbc35.so
Description=Lab
Host=example.com
Namespace=LAB
UID=lab
Password=labExamplePwd
Port=41000
Protocol=TCP
Query Timeout=1
Static Cusrsors=0
Trace=off
TraceFile=iodbctrace.log
Authentication Method=0
Security Level=2
Service Principal Name=example.com

[Default]
Driver=/usr/cachesys/bin/libcacheodbc35.so
```
#### Examples:<sub id="examples"></sub>

The examples below use the following setup:

__[Private Options Configuration:](https://ugate.github.io/sqler/Manager.html#~PrivateOptions)__ (appended to the subsequent connection options, shows other connections for illustration purposes)
```jsdocp ./test/fixtures/priv.json
```

> __NOTE:__ `univ.db.cache` does not require any additional private properties since the Cachè ODBC driver only requires the `DSN` in the connection options

__[Connection Options Configuration:](global.html#OdbcConnectionOptions)__
```jsdocp ./test/fixtures/cache/cache.json
```

> __NOTE:__ [`db.connections.driverOptions.connection.DSN`](global.html#OdbcConnectionOptions) interpolates into `db.connections[].service`

Test code that illustrates how to use Cachè + ODBC with various examples
```jsdocp ./test/fixtures/run-example.js
```

__Read:__
```jsdocp ./test/db/cache/site/read.lab.departments.sql
-- db/cache/site/read.lab.departments.sql
```
```js
async function runExample(conf) {
  const mgr = new Manager(conf);
  // initialize connections and set SQL functions
  await mgr.init();

  // execute the SQL statement and capture the results
  const rslts = await mgr.db.cache.site.read.lab.departments({
    binds: {
      labDeptName: 'Blood'
    }
  });

  console.log('Lab Departments:', rslts.rows);

  return { manager: mgr, result: rslts };
}
```

__Create:__
```jsdocp ./test/db/cache/site/create.lab.departments.sql
-- db/cache/site/create.lab.departments.sql
```
```js
async function runExample(conf) {
  const mgr = new Manager(conf);
  // initialize connections and set SQL functions
  await mgr.init();

  // begin tranaction
  const txId = await mgr.db.cache.beginTransaction();
  
  let exec1, exec2;
  try {
    // set the transaction ID on the execution options
    // so the SQL executions are invoked within the
    // same transaction scope from the connection pool

    // execute within a transaction scope, but don't commit
    // (i.e. autoCommit === false and transactionId = txId)
    exec1 = await mgr.db.cache.site.create.lab.departments({
      autoCommit: false,
      transactionId: txId,
      binds: {
        id: 1,
        name: 'Blood Bank',
        code: 'BB'
      }
    });

    // execute within the same transaction scope
    // and commit after the satement has executed
    // (i.e. autoCommit === true and transactionId = txId)
    exec2 = await mgr.db.cache.site.create.lab.departments({
      autoCommit: true,
      transactionId: txId,
      binds: {
        id: 2,
        name: 'Blood Bank Send Out',
        code: 'BBSO'
      }
    });
  } catch (err) {
    if (exec1) {
      // can rollback using either exc1.rollback() or exc2.rollback()
      await exc1.rollback();
    }
  }

  // return the results
  return {
    manager: mgr,
    result: {
      dept1: exec1 && exec1.rows,
      dept2: exec2 && exec2.rows
    }
  };
}
```