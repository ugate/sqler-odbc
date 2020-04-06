#!/bin/bash -e

# ------------------- PostgreSQL ODBC Drivers -------------------

RED='\033[0;31m'
GRAY='\033[0;37m'
NO_COLOR='\033[0m'

if [[ -z "${ODBCINST}" ]]; then
  echo "${GRAY}Setting ODBCINST=/etc/odbcinst.ini${NO_COLOR}"
  export ODBCINST=/etc/odbcinst.ini
fi

PGSQL_DRIVER=`odbcinst -q -d | sed -nre 's/\[(PostgreSQL([[:space:]]Unicode)?)\]/\1/pi'`

if [[ -z "${PGSQL_DRIVER}" ]]; then
  echo "${RED}Unable to find PostgreSQL driver name from: odbcinst -q -d ${NO_COLOR}"
  exit 1
fi

echo "${GRAY}Installing PostgreSQL ODBC driver${NO_COLOR}"

sudo apt-get install odbc-postgresql

echo "${GRAY}Installing PostgreSQL ODBC Data Source for driver ${PGSQL_DRIVER} ${NO_COLOR}"

echo "${GRAY}Installed PostgreSQL ODBC driver${NO_COLOR}"