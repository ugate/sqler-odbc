### ⚙️ Setup &amp; Configuration <sub id="conf"></sub>:

> __Most of documentation pertaining to general configuration for `sqler-odbc` can be found in the [`sqler` manual](https://ugate.github.io/sqler).__

| 〽️<u>Required Module</u> | ✔️<u>Compatible Version</u> |
| :---         |     :---:      |
| [`sqler`](https://ugate.github.io/sqler/) | __`>= 5.4.0`__ |
| [`odbc`](https://www.npmjs.com/package/odbc/) | __`>= 2.2.2`__ |

Install the required modules:
```sh
npm install sqler
npm install sqler-odbc
npm install odbc
```

Connection and execution option extensions can be found under the API docs for [globals](global.html).

### 💡 Examples<sub id="examples"></sub>:

Although, `sqler-odbc` can be used with any ODBC compliant database driver, below illustrates the use with some popular implementations

1. [SQL Server](tutorial-2-mssql.html)
1. [Oracle DB](tutorial-2-oracle.html)
1. [MySQL](tutorial-2-mysql.html)
1. [PostgreSQL](tutorial-2-postgres.html)
1. [InterSystems Cachè](tutorial-2-mssql.html)
1. [Other Databases](tutorial-2-other.html)