#!/bin/bash
set -e

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

# install auto creates postgres user (default install: --auth-local peer --auth-host scram-sha-256)
# use the current unix user as the postgresql superuser unless it is already set or is postgres
UID=`[[ -n "$POSTGRESQL_UID" ]] && echo $POSTGRESQL_UID || echo "$(whoami)"`
if [[ "${UID}" != "postgres" ]]; then
  echo "Creating PostgreSQL user/role $UID (grant all on postgres DB)"
  #sudo -u postgres -c "createuser -s ${UID}"
  sudo -u postgres psql -c "CREATE ROLE ${UID} WITH LOGIN SUPERUSER"
  sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE postgres TO ${UID}"
fi

echo "Installed PostgreSQL $PGSQL_VER (accessible via sueruser $UID)"