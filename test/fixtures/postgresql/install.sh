#!/bin/bash -e

# ------------------- PostgreSQL -------------------

if [[ -z "${POSTGRESQL_MAJOR}" ]]; then
  echo "[ERROR]: Environmental variable POSTGRESQL_MAJOR is required when installing PostgreSQL"
  exit 1
fi

PGSQL_VER="$POSTGRESQL_MAJOR"

echo "Installing PostgreSQL $PGSQL_VER"

# uninstall any existing postgresql versions
sudo apt-get --purge remove postgresql\*

# install postgresql
sudo apt-get install postgresql-$POSTGRESQL_MAJOR

echo "Installed MySQL $PGSQL_VER"