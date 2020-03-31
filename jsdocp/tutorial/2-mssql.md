### 💡 [SQL Server](https://www.microsoft.com/en-us/sql-server/):

> Alternatively, [sqler-mssql](https://www.npmjs.com/package/sqler-mssql) can be used instead of ODBC.

#### Setup:<sub id="setup"></sub>

__Install the [SQL Server ODBC Drivers](https://docs.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server)__

__Windows ODBC Data Source__

Configure the ODBC driver via the [ODBC Data Source Administrator](https://docs.microsoft.com/en-us/sql/odbc/admin/odbc-data-source-administrator):

![Windows ODBC Data Source 1](./img/odbc-mssql-ds1.jpg "Windows ODBC Data Source 1")

![Windows ODBC Data Source 2](./img/odbc-mssql-ds2.jpg "Windows ODBC Data Source 2")

![Windows ODBC Data Source 3](./img/odbc-mssql-ds3.jpg "Windows ODBC Data Source 3")

![Windows ODBC Data Source 4](./img/odbc-mssql-ds4.jpg "Windows ODBC Data Source 4")

![Windows ODBC Data Source 5](./img/odbc-mssql-ds5.jpg "Windows ODBC Data Source 5")

__UNIX `/etc/odbc.ini` [`unixODBC`](http://www.unixodbc.org/) ([SQL Server ODBC Connection Parameters](https://docs.microsoft.com/en-us/sql/connect/odbc/dsn-connection-string-attribute?view=sql-server-ver15))__
```jsdocp ./test/fixtures/mssql/odbc.ini
```

#### Examples:<sub id="examples"></sub>

The examples below use the following setup:

__[Private Options Configuration:](https://ugate.github.io/sqler/Manager.html#~PrivateOptions)__ (appended to the subsequent connection options, shows other connections for illustration purposes)
```jsdocp ./test/fixtures/priv.json
```

__[Connection Options Configuration:](global.html#OdbcConnectionOptions)__
```jsdocp ./test/fixtures/mssql/conf.json
```

> __NOTE:__ [`db.connections.driverOptions.connection`](global.html#OdbcConnectionOptions) for `DSN` interpolates into `db.connections[].service` while `UID` and `PWD` interpolate to properties on `univ.db.mssql` set on the private options configuration. A complete listing of available SQL Server connection string attributes for use on [`options.driverOptions.connection`](global.html#OdbcConnectionOptions) can be found [here](https://docs.microsoft.com/en-us/sql/connect/odbc/dsn-connection-string-attribute).

Test code that illustrates how to use SQL Server + ODBC with various examples
```jsdocp ./test/fixtures/run-example.js
```

__Create Table:__

```jsdocp ./test/db/mssql/setup/create.tables.sql
-- db/mssql/setup/create.tables.sql
```

```jsdocp ./test/lib/mssql/setup/create.tables.js
```

__Create Rows:__

```jsdocp ./test/db/mssql/create.table.rows.sql
-- db/mssql/create.table.rows.sql
```

```jsdocp ./test/lib/mssql/create.table.rows.js
```

__Read Rows:__

```jsdocp ./test/db/mssql/read.table.rows.sql
-- db/mssql/read.table.rows.sql
```

```jsdocp ./test/lib/mssql/read.table.rows.js
```

__Update Rows:__

```jsdocp ./test/db/mssql/update.table.rows.sql
-- db/mssql/update.table.rows.sql
```

```jsdocp ./test/lib/mssql/update.table.rows.js
```

__Delete Rows:__

```jsdocp ./test/db/mssql/delete.table.rows.sql
-- db/mssql/delete.table.rows.sql
```

```jsdocp ./test/lib/mssql/delete.table.rows.js
```

__Delete Table:__

```jsdocp ./test/db/mssql/setup/delete.tables.sql
-- db/mssql/setup/delete.tables.sql
```

```jsdocp ./test/lib/mssql/setup/delete.tables.js
```