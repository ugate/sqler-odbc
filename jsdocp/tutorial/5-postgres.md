### 💡 [PostgreSQL](https://www.postgresql.org/) Examples:

__Install the drivers from [odbc.postgresql.org](https://odbc.postgresql.org/)__

__Windows ODBC Data Source__

When installing PostgreSQL using [Stack Builder](https://www.enterprisedb.com/docs/en/9.3/pginstguide/PostgreSQL_Installation_Guide-08.htm), select the ODBC driver from the available drivers and follow the prompts to install them. Otherwise, the ODBC drivers can be download separately from [here](https://odbc.postgresql.org/).

![Windows ODBC Data Source 1](./img/odbc-postgresql-ds1.jpg "Windows ODBC Data Source 1")

Configure the ODBC driver via the [ODBC Data Source Administrator](https://docs.microsoft.com/en-us/sql/odbc/admin/odbc-data-source-administrator):

![Windows ODBC Data Source 2](./img/odbc-postgresql-ds2.jpg "Windows ODBC Data Source 2")

![Windows ODBC Data Source 3](./img/odbc-postgresql-ds3.jpg "Windows ODBC Data Source 3")

__UNIX `/etc/odbc.ini` [`unixODBC`](http://www.unixodbc.org/) ([PostgreSQL ODBC Connection Parameters](https://odbc.postgresql.org/docs/config-opt.html))__
```jsdocp ./test/fixtures/postgresql/odbc.ini
```

#### Examples:<sub id="examples"></sub>

The examples below use the following setup:

__[Private Options Configuration:](https://ugate.github.io/sqler/Manager.html#~PrivateOptions)__ (appended to the subsequent connection options, shows other connections for illustration purposes)
```jsdocp ./test/fixtures/priv.json
```

__[Connection Options Configuration:](global.html#OdbcConnectionOptions)__
```jsdocp ./test/fixtures/postgresql/conf.json
```

> __NOTE:__ [`db.connections.driverOptions.connection`](global.html#OdbcConnectionOptions) for `DSN` interpolates into `db.connections[].service`

Test code that illustrates how to use PostgreSQL + ODBC with various examples
```jsdocp ./test/fixtures/run-example.js
```

__Create Table:__

```jsdocp ./test/db/postgresql/setup/create.tables.sql
-- db/postgresql/setup/create.tables.sql
```

```jsdocp ./test/lib/postgresql/setup/create.tables.js
```

__Create Rows:__

```jsdocp ./test/db/postgresql/create.table.rows.sql
-- db/postgresql/create.table.rows.sql
```

```jsdocp ./test/lib/postgresql/create.table.rows.js
```

__Read Rows:__

```jsdocp ./test/db/postgresql/read.table.rows.sql
-- db/postgresql/read.table.rows.sql
```

```jsdocp ./test/lib/postgresql/read.table.rows.js
```

__Update Rows:__

```jsdocp ./test/db/postgresql/update.table.rows.sql
-- db/postgresql/update.table.rows.sql
```

```jsdocp ./test/lib/postgresql/update.table.rows.js
```

__Delete Rows:__

```jsdocp ./test/db/postgresql/delete.table.rows.sql
-- db/postgresql/delete.table.rows.sql
```

```jsdocp ./test/lib/postgresql/delete.table.rows.js
```

__Delete Table:__

```jsdocp ./test/db/postgresql/setup/delete.tables.sql
-- db/postgresql/setup/delete.tables.sql
```

```jsdocp ./test/lib/postgresql/setup/delete.tables.js
```