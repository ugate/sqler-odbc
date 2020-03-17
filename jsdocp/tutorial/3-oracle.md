### 💡 [Oracle Database](https://www.oracle.com/database/):

> Alternatively, [sqler-oracle](https://www.npmjs.com/package/sqler-oracle) can be used instead of ODBC.

#### Setup:<sub id="setup"></sub>

__Install the [Oracle Instant Client &amp; ODBC Instant Client](https://www.oracle.com/database/technologies/releasenote-odbc-ic.html)__ (latet versions seems to work best)

__Windows ODBC Data Source__

![Windows ODBC Data Source 1](./img/odbc-oracle-ds1.jpg "Windows ODBC Data Source 1")

![Windows ODBC Data Source 2](./img/odbc-oracle-ds2.jpg "Windows ODBC Data Source 2")

__UNIX `/etc/odbc.ini` [`unixODBC`](http://www.unixodbc.org/)__
```bash
[ODBC Data Sources]
Test=Test

[Test]
Driver = /usr/lib/oracle/18.4.0.0.0/client/lib/libsqora.so.18.4
DSN = Test
ServerName = XE
UserID = xe
Password = myOraclePwd
```

#### Examples:<sub id="examples"></sub>

The examples below use the following setup:

__[Private Options Configuration:](https://ugate.github.io/sqler/Manager.html#~PrivateOptions)__ (appended to the subsequent connection options, shows other connections for illustration purposes)
```jsdocp ./test/fixtures/priv.json
```

__[Connection Options Configuration:](global.html#OdbcConnectionOptions)__
```jsdocp ./test/fixtures/oracle/oracle.json
```

> __NOTE:__ [`db.connections.driverOptions.connection`](global.html#OdbcConnectionOptions) for `DSN` interpolates into `db.connections[].service`

Test code that illustrates how to use Oracle + ODBC with various examples
```jsdocp ./test/fixtures/run-example.js
```

__Read:__
```jsdocp ./test/db/oracle/read.table.rows.sql
-- db/oracle/read.table.rows.sql
```

```js
async function runExample(conf) {
  const mgr = new Manager(conf);
  // initialize connections and set SQL functions
  await mgr.init();

  // execute the SQL statement and capture the results
  const rslt = await mgr.db.oracle.hr.read.countries({
    binds: {
      name: 'United'
    }
  });

  console.log('Countries:', rslts.rows);

  return { manager: mgr, result: rslt };
}
```

__Create:__
```sql
-- db/oracle/hr/create.country.sql
INSERT INTO HR.COUNTRIES (COUNTRY_ID, COUNTRY_NAME, REGION_ID)
VALUES (:id, :name, :region)
```
```js
async function runExample(conf) {
  const mgr = new Manager(conf);
  // initialize connections and set SQL functions
  await mgr.init();

  // begin tranaction
  const txId = await mgr.db.oracle.beginTransaction();
  
  let exec1, exec2;
  try {
    // set the transaction ID on the execution options
    // so the SQL executions are invoked
    // within the same transaction scope

    // execute within a transaction scope
    // (i.e. autoCommit === false and transactionId = txId)
    exec1 = await mgr.db.oracle.hr.create.country({
      autoCommit: false,
      transactionId: txId,
      binds: {
        id: 1,
        name: 'New Country 1',
        region: 2
      }
    });

    // execute within the same transaction scope
    // and commit after the satement has executed
    // (i.e. autoCommit === true and transactionId = txId)
    exec2 = await mgr.db.oracle.hr.create.country({
      autoCommit: false,
      transactionId: txId,
      binds: {
        id: 2,
        name: 'New Country 2',
        region: 2
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
      country1: exec1 && exec1.rows,
      country2: exec2 && exec2.rows
    }
  };
}
```