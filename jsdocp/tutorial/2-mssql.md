### 💡 [SQL Server](https://www.microsoft.com/en-us/sql-server/):

Alternatively, [sqler-mssql](https://www.npmjs.com/package/sqler-mssql) can be used instead of ODBC.

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
Server = example.com
```

```sql
SELECT RO.optname AS "optName", RO.value AS "value",
RO.major_version AS "majorVersion", RO.minor_version AS "minorVersion",
RO.revision AS "revision", RO.install_failures AS "installFailures"
FROM dbo.MSreplication_options RO
WHERE UPPER(RO.optname) LIKE CONCAT(CONCAT('%', UPPER(:optName)), '%')
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