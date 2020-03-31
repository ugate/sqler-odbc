### 💡 [Oracle Database](https://www.oracle.com/database/):

> Alternatively, [sqler-oracle](https://www.npmjs.com/package/sqler-oracle) can be used instead of ODBC.

#### Setup:<sub id="setup"></sub>

__Install the [Oracle Instant Client &amp; ODBC Instant Client](https://www.oracle.com/database/technologies/releasenote-odbc-ic.html)__ (latet versions seems to work best)

__Windows ODBC Data Source__

Configure the ODBC driver via the [ODBC Data Source Administrator](https://docs.microsoft.com/en-us/sql/odbc/admin/odbc-data-source-administrator):

![Windows ODBC Data Source 1](./img/odbc-oracle-ds1.jpg "Windows ODBC Data Source 1")

![Windows ODBC Data Source 2](./img/odbc-oracle-ds2.jpg "Windows ODBC Data Source 2")

__UNIX `/etc/odbc.ini` [`unixODBC`](http://www.unixodbc.org/) ([Oracle ODBC Connection Parameters](https://docs.oracle.com/cd/E17952_01/connector-odbc-en/connector-odbc-configuration-connection-parameters.html))__
```jsdocp ./test/fixtures/oracle/odbc.ini
```

#### Examples:<sub id="examples"></sub>

The examples below use the following setup:

__[Private Options Configuration:](https://ugate.github.io/sqler/Manager.html#~PrivateOptions)__ (appended to the subsequent connection options, shows other connections for illustration purposes)
```jsdocp ./test/fixtures/priv.json
```

__[Connection Options Configuration:](global.html#OdbcConnectionOptions)__
```jsdocp ./test/fixtures/oracle/conf.json
```

> __NOTE:__ [`db.connections.driverOptions.connection`](global.html#OdbcConnectionOptions) for `DSN` interpolates into `db.connections[].service`

Test code that illustrates how to use Oracle + ODBC with various examples
```jsdocp ./test/fixtures/run-example.js
```

__Create Table:__

```jsdocp ./test/db/oracle/setup/create.tables.sql
-- db/oracle/setup/create.tables.sql
```

```jsdocp ./test/lib/oracle/setup/create.tables.js
```

__Create Rows:__

```jsdocp ./test/db/oracle/create.table.rows.sql
-- db/oracle/create.table.rows.sql
```

```jsdocp ./test/lib/oracle/create.table.rows.js
```

__Read Rows:__

```jsdocp ./test/db/oracle/read.table.rows.sql
-- db/oracle/read.table.rows.sql
```

```jsdocp ./test/lib/oracle/read.table.rows.js
```

__Update Rows:__

```jsdocp ./test/db/oracle/update.table.rows.sql
-- db/oracle/update.table.rows.sql
```

```jsdocp ./test/lib/oracle/update.table.rows.js
```

__Delete Rows:__

```jsdocp ./test/db/oracle/delete.table.rows.sql
-- db/oracle/delete.table.rows.sql
```

```jsdocp ./test/lib/oracle/delete.table.rows.js
```

__Delete Table:__

```jsdocp ./test/db/oracle/setup/delete.tables.sql
-- db/oracle/setup/delete.tables.sql
```

```jsdocp ./test/lib/oracle/setup/delete.tables.js
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