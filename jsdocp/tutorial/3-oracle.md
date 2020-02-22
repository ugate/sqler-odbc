### 💡 [Oracle Database](https://www.oracle.com/database/):

Alternatively, [sqler-oracle](https://www.npmjs.com/package/sqler-oracle) can be used instead of ODBC.

__Install the [ODBC Instant Client](https://www.oracle.com/database/technologies/releasenote-odbc-ic.html)__

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

The examples below use the following setup:
```js
const conf = {
  "univ": {
    "db": {
      // really don't need any private data when the
      // Data Source contains the connection credentials
      "myOracleDb": {}
    }
  },
  "db": {
    "dialects": {
      "odbc": "sqler-odbc"
    },
    "connections": [
      {
        "id": "myOracleDb",
        "name": "oracle",
        "dir": "db/oracle",
        "service": "Test", // service = DSN
        "dialect": "odbc",
        "pool": {
          "min": 1,
          "max": 4,
          "increment": 1
        },
        "driverOptions": {
          "connection": {
            // connection string parameters
            "FileUsage": 1
          },
          "pool": {
            // odbc module specific pool options
            "shrink": true
          }
        }
      }
    ]
  }
};

// see subsequent examples for different examples
const { manager, result } = await runExample(conf);

console.log('Result:', result);

// after we're done using the manager we should close it
process.on('SIGINT', async function sigintDB() {
  await manager.close();
  console.log('Manager has been closed');
});
```

__Read:__
```sql
-- db/oracle/hr/read.countries.sql
SELECT CO.COUNTRY_ID AS "id", CO.COUNTRY_NAME AS "name"
FROM HR.COUNTRIES CO
WHERE UPPER(CO.COUNTRY_NAME) LIKE UPPER('%' || :name || '%')
ORDER BY CO.COUNTRY_NAME ASC
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