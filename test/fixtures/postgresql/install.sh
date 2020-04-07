#!/bin/bash
set -e

# ------------------- PostgreSQL -------------------

if [[ -z "${POSTGRESQL_MAJOR}" || -z "${POSTGRESQL_UID}" ]]; then
  echo "[ERROR]: Environmental variables POSTGRESQL_MAJOR and POSTGRESQL_UID are required when installing PostgreSQL"
  exit 1
fi

PGSQL_VER="$POSTGRESQL_MAJOR"

echo "Installing PostgreSQL $PGSQL_VER"

# uninstall any existing postgresql versions
sudo apt-get --purge remove postgresql\*

# install postgresql
sudo apt-get install postgresql-$POSTGRESQL_MAJOR

# show postgres auth conf
cat /${PGDATA}/pg_hba.conf

# install auto creates postgres user (default install: --auth-local peer --auth-host scram-sha-256)
if [[ "${POSTGRESQL_UID}" != "postgres" ]]; then
  echo "Creating PostgreSQL user/role $POSTGRESQL_UID (grant all on postgres DB)"
  PWD=`[[ -n "${POSTGRESQL_PWD}" ]] && echo $POSTGRESQL_PWD || echo ""`
  #sudo -u postgres -c "createuser -s ${POSTGRESQL_UID}"
  sudo -u postgres psql -c "CREATE ROLE ${POSTGRESQL_UID} WITH LOGIN SUPERUSER PASSWORD '${PWD}'"
  sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE postgres TO ${POSTGRESQL_UID}"
fi

echo "Installed PostgreSQL $PGSQL_VER"