### 💡 [InterSystems Cachè](https://www.intersystems.com/products/cache/) Examples:

__Install the drivers from [ftp.intersystems.com](ftp://ftp.intersystems.com/pub/cache/odbc)__

__Windows ODBC Data Source__

If installing PostgreSQL using [Stack Builder](https://www.enterprisedb.com/docs/en/9.3/pginstguide/PostgreSQL_Installation_Guide-08.htm), select the ODBC driver from the available drivers and follow the prompts to install them. Otherwise, the ODBC drivers can be download separately from [here](https://odbc.postgresql.org/).

![Windows ODBC Data Source 1](./img/odbc-postgresql-ds1.jpg "Windows ODBC Data Source 1")

![Windows ODBC Data Source 2](./img/odbc-postgresql-ds2.jpg "Windows ODBC Data Source 2")

__UNIX `/etc/odbc.ini` [`unixODBC`](http://www.unixodbc.org/) ([PostgreSQL ODBC Connection Parameters](https://odbc.postgresql.org/docs/config-opt.html))__
```jsdocp ./test/fixtures/postgresql/odbc.ini
```

The examples below use the following setup:
```js
const conf = {
  "univ": {
    "db": {
      // really don't need any private data when the
      // Data Source contains the connection credentials
      "myCacheDb": {}
    }
  },
  "db": {
    "dialects": {
      "odbc": "sqler-odbc"
    },
    "connections": [
      {
        "id": "myCacheDb",
        "name": "cache",
        "dir": "db/cache",
        "service": "Lab", // service = DSN
        "dialect": "odbc",
        "pool": {
          "min": 1,
          "max": 4,
          "increment": 1
        },
        "driverOptions": {
          "connection": {
            // connection string parameters
            "STATIC CURSORS": 1
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
-- db/cache/site/read.lab.departments.sql
SELECT DP.ID AS "id", DP.LabDeptCode AS "code", DP.LabDeptName AS "name"
FROM SITE.MA_LabDept DP
WHERE UPPER(DP.LabDeptName) LIKE UPPER('%' || :labDeptName || '%')
ORDER BY DP.LabDeptName ASC
```
```js
async function runExample(conf) {
  const mgr = new Manager(conf);
  // initialize connections and set SQL functions
  await mgr.init();

  // execute the SQL statement and capture the results
  const rslt = await mgr.db.cache.site.read.lab.departments({
    binds: {
      labDeptName: 'Blood'
    }
  });

  console.log('Lab Departments:', rslts.rows);

  return { manager: mgr, result: rslt };
}
```

__Create:__
```sql
-- db/cache/site/create.lab.departments.sql
INSERT INTO MA_LabDept (ID, LabDeptName, LabDeptCode)
VALUES (:id, :name, :code)
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
    // so the SQL executions are invoked
    // within the same transaction scope

    // execute within a transaction scope
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
      autoCommit: false,
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