### ⚙️ Setup &amp; Configuration <sub id="conf"></sub>:

> __Most of documentation pertaining to general configuration for `sqler-odbc` can be found in the [`sqler` manual](https://ugate.github.io/sqler).__

| 〽️<u>Required Module</u> | ✔️<u>Compatible Version</u> |
| :---:         |     :---:      |
| [`sqler`](https://ugate.github.io/sqler/) | __`>= 5.4.0`__ |
| [`odbc`](https://www.npmjs.com/package/odbc/) | __`>= 2.2.2`__ |

Install the required modules:
```sh
npm install sqler
npm install sqler-odbc
npm install odbc
```

Connection and execution option extensions can be found under the API docs for [globals](global.html).

#### 📅 ODBC ANSI Date/Time<sub id="datetime"></sub>

Due to the nature of ODBC, dates may need to be formatted to/from string values according to ANSI standards noted below.

| <u>Notation</u>           | <u>Description</u>                    | <u></u>
| :---                      | :---                                  | :---
| YYYY                      | 4-digit year                          |
| MM                        | 2-digit month (01 to 12)              |
| DD                        | 2-digit day (01 to 31)                |
| HH                        | 2-digit hour (00 to 23)               |
| MI                        | 2-digit minute (00 to 59)             |
| SS                        | 2-digit second (00 to 59)             |
| FFF                       | Fraction of a second (1 to 9 digits)  |
| TH                        | 2-digit hour offset (-12 to 14)       |
| TM                        | 2-digit minute offset (00 to 59)      |
| YEARS                     | Number of years (max of 9999)         |
| DAYS                      | Number of days (max of 3652047)       |

Using the forementioned notation, the following data types can be used on ODBC dates:

| <u>Data Type</u>          | <u>Format</u>                           | <u>Example</u>
| :---                      | :---                                    | :---
| DATE                      | `YYYY-MM-DD`                            | `2030-01-31`
| TIME (w/o timezone)       | `HH:MI:SS.FFF`                          | `12:01:20.903`
| TIME (with timezone)      | `HH:MI:SS.FFF [+|-]TH:TM`               | `12:01:20.903 -07:00`
| TIMESTAMP (w/o timezone)  | `YYYY-MM-DD HH:MI:SS.FFF`               | `2030-01-31 12:01:20.903`
| TIMESTAMP (with timezone) | `YYYY-MM-DD HH:MI:SS.FFF [+|-]TH:TM`    | `2030-01-31 12:01:20.903 -07:00`
| INTERVAL YEAR TO MONTH    | `[+|-]YEARS-MM`                         | `+130-01`
| INTERVAL DAY TO SECONDS   | `[+|-]DAYS HH:MI:SS.FFF`                | `-47482 12:01:20.903`

> __NOTE: The [`moment-db` module](https://www.npmjs.com/package/moment-db) can be used to assist with ANSI compatible database date formatting__

### 💡 Examples<sub id="examples"></sub>:

Although, `sqler-odbc` can be used with any ODBC compliant database driver, below illustrates the use with some popular implementations

1. [SQL Server](tutorial-2-mssql.html)
1. [Oracle DB](tutorial-2-oracle.html)
1. [MySQL](tutorial-2-mysql.html)
1. [PostgreSQL](tutorial-2-postgres.html)
1. [InterSystems Cachè](tutorial-2-mssql.html)
1. [Other Databases](tutorial-2-other.html)