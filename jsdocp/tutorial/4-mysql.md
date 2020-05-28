### 💡 [InterSystems Cachè](https://www.intersystems.com/products/cache/) Examples:

__Install the drivers from the [MySQL website](https://dev.mysql.com/downloads/connector/odbc) (if not installed when MySQL was installed)__

__Windows ODBC Data Source__

Configure the ODBC driver via the [ODBC Data Source Administrator](https://docs.microsoft.com/en-us/sql/odbc/admin/odbc-data-source-administrator):

![Windows ODBC Data Source 1](./img/odbc-mysql-ds1.jpg "Windows ODBC Data Source 1")

![Windows ODBC Data Source 2](./img/odbc-mysql-ds2.jpg "Windows ODBC Data Source 2")

__UNIX `/etc/odbc.ini` [`unixODBC`](http://www.unixodbc.org/) ([MySQL ODBC Connection Parameters](https://dev.mysql.com/doc/connector-odbc/en/connector-odbc-configuration-connection-parameters.html))__
```jsdocp ./test/fixtures/mysql/odbc.ini
```

#### Examples:<sub id="examples"></sub>

The examples below use the following setup:

__[Private Options Configuration:](https://ugate.github.io/sqler/Manager.html#~PrivateOptions)__ (appended to the subsequent connection options, shows other connections for illustration purposes)
```jsdocp ./test/fixtures/priv.json
```

__[Connection Options Configuration:](global.html#OdbcConnectionOptions)__
```jsdocp ./test/fixtures/mysql/conf.json
```

> __NOTE:__ [`db.connections.driverOptions.connection`](global.html#OdbcConnectionOptions) for `DSN` interpolates into `db.connections[].service`

Test code that illustrates how to use MySQL + ODBC with various examples
```jsdocp ./test/fixtures/run-example.js
```

__Create Table:__

```jsdocp ./test/db/mysql/setup/create.tables.sql
-- db/mysql/setup/create.tables.sql
```

```jsdocp ./test/lib/mysql/setup/create.tables.js
```

__Create Rows:__

```jsdocp ./test/db/mysql/create.table.rows.sql
-- db/mysql/create.table.rows.sql
```

```jsdocp ./test/lib/mysql/create.table.rows.js
```

__Read Rows:__

```jsdocp ./test/db/mysql/read.table.rows.sql
-- db/mysql/read.table.rows.sql
```

```jsdocp ./test/lib/mysql/read.table.rows.js
```

__Update Rows:__<sub id="update"></sub>

Although the following updates can be made within a single SQL script, multiple SQL scripts are used to illustrate the use of tranactions and/or prepared statements.

```jsdocp ./test/db/mysql/update.table1.rows.sql
-- db/mysql/update.table1.rows.sql
```
```jsdocp ./test/db/mysql/update.table2.rows.sql
-- db/mysql/update.table2.rows.sql
```

```jsdocp ./test/lib/mysql/update.table.rows.js
```

__Delete Rows:__

```jsdocp ./test/db/mysql/delete.table.rows.sql
-- db/mysql/delete.table.rows.sql
```

```jsdocp ./test/lib/mysql/delete.table.rows.js
```

__Delete Table:__

```jsdocp ./test/db/mysql/setup/delete.tables.sql
-- db/mysql/setup/delete.tables.sql
```

```jsdocp ./test/lib/mysql/setup/delete.tables.js
```