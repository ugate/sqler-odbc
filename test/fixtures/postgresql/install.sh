#!/bin/bash -e

# ------------------- PostgreSQL -------------------

RED='\033[0;31m'
GRAY='\033[0;37m'
NO_COLOR='\033[0m'

if [[ -z "${POSTGRESQL_MAJOR}" ]]; then
  echo "${RED}Environmental variable POSTGRESQL_MAJOR is required when installing PostgreSQL${NO_COLOR}"
  exit 1
fi

PGSQL_VER="$POSTGRESQL_MAJOR"

echo "${GRAY}Installing PostgreSQL $PGSQL_VER ${NO_COLOR}"

# uninstall any existing postgresql versions
sudo apt-get --purge remove postgresql\*

# install postgresql
sudo apt-get install postgresql-$POSTGRESQL_MAJOR

echo "${GRAY}Installed MySQL $PGSQL_VER ${NO_COLOR}"