### 💡 [InterSystems Cachè](https://www.intersystems.com/products/cache/) Examples:

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
        "service": "Lab",
        "dialect": "odbc",
        "pool": {
          "min": 1,
          "max": 4,
          "increment": 1
        },
        "driverOptions": {
          // ODBC connection string property names/values
          // (ODBC vendor specific)
          "connection": {
            // DSN interpolates into connections[0].service
            "DSN": "${service}",
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