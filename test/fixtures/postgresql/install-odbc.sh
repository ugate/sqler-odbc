#!/bin/bash -e

# ------------------- PostgreSQL ODBC Drivers -------------------

if [[ -z "${ODBCINST}" ]]; then
  echo "Setting ODBCINST=/etc/odbcinst.ini"
  export ODBCINST=/etc/odbcinst.ini
fi

if [[ -z "${POSTGRESQL_ODBC_DATASOURCE}" ]]; then
  echo "[ERROR]: Environmental variable POSTGRESQL_ODBC_DATASOURCE is required when installing PostgreSQL ODBC Drivers"
  exit 1
fi

echo "Installing PostgreSQL ODBC driver"

# install PostgreSQL ODBC driver
sudo apt-get install odbc-postgresql

# validate/capture driver name
PGSQL_DRIVER=`odbcinst -q -d`
printf "Looking for PostgreSQL driver in: \n${PGSQL_DRIVER}\n"
PGSQL_DRIVER=`echo $PGSQL_DRIVER | sed -nre 's/\[(PostgreSQL([[:space:]]Unicode)?)\]/\1/pi'`

if [[ -z "${PGSQL_DRIVER}" ]]; then
  echo "[ERROR]: Unable to find PostgreSQL driver name"
  exit 1
fi

echo "Installing PostgreSQL ODBC Data Source for driver $PGSQL_DRIVER"

P_SVR=`[[ -n "$POSTGRESQL_ODBC_SERVER" ]] && echo $POSTGRESQL_ODBC_SERVER || echo ""`
P_PRT=`[[ -n "$POSTGRESQL_ODBC_PORT" ]] && echo $POSTGRESQL_ODBC_PORT || echo ""`
P_DBN=`[[ -n "$POSTGRESQL_ODBC_DATABASE" ]] && echo $POSTGRESQL_ODBC_DATABASE || echo ""`
P_UID=`[[ -n "$POSTGRESQL_ODBC_UID" ]] && echo $POSTGRESQL_ODBC_UID || echo "postgres"`
P_PWD=`[[ -n "$POSTGRESQL_ODBC_PWD" ]] && echo $POSTGRESQL_ODBC_PWD || echo ""`

printf "[${POSTGRESQL_ODBC_DATASOURCE}]\n" > postgresql-ds.txt
printf "Driver=${PGSQL_DRIVER}\n" >> postgresql-ds.txt
printf "Description=PostgreSQL Connector/ODBC\n" >> postgresql-ds.txt
if [[ -n "$P_SVR" ]]; then
  printf "Server=${P_SVR}\n" >> postgresql-ds.txt
fi
if [[ -n "$P_PRT" ]]; then
  printf "Port=${P_PRT}\n" >> postgresql-ds.txt
fi
if [[ -n "$P_DBN" ]]; then
  printf "Database=${P_DBN}\n" >> postgresql-ds.txt
fi
printf "UID=${P_UID}\n" >> postgresql-ds.txt
printf "PWD=${P_PWD}\n" >> postgresql-ds.txt
printf "UseMultipleStatements=1\n" >> postgresql-ds.txt

# install data source
sudo odbcinst -i -s -f postgresql-ds.txt
rm -f postgresql-ds.txt

echo "Installed PostgreSQL ODBC driver ${PGSQL_DRIVER}. Data Source ${POSTGRESQL_ODBC_DATASOURCE} is now available for use"