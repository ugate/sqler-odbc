#!/bin/bash -e

# ------------------- PostgreSQL ODBC Drivers -------------------

if [[ -z "${ODBCINST}" ]]; then
  echo "Setting ODBCINST=/etc/odbcinst.ini"
  export ODBCINST=/etc/odbcinst.ini
fi

PGSQL_DRIVER=`odbcinst -q -d`
printf "Looking for PostgreSQL driver in: \n${PGSQL_DRIVER}"
PGSQL_DRIVER=`echo $PGSQL_DRIVER | sed -nre 's/\[(PostgreSQL([[:space:]]Unicode)?)\]/\1/pi'`

if [[ -z "${PGSQL_DRIVER}" ]]; then
  echo "Unable to find PostgreSQL driver name from:"
  exit 1
fi

echo "Installing PostgreSQL ODBC driver $PGSQL_DRIVER"

sudo apt-get install odbc-postgresql

echo "Installing PostgreSQL ODBC Data Source for driver $PGSQL_DRIVER"

echo "Installed PostgreSQL ODBC driver $PGSQL_DRIVER"