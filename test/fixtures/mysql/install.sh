#!/bin/bash -e

# ------------------- MySQL -------------------

if [[ -z "${MYSQL_MAJOR}" || -z "${MYSQL_MINOR}" || -z "${MYSQL_PATCH}" ]]; then
  echo "[ERROR]: Environmental variables MYSQL_MAJOR, MYSQL_MINOR and MYSQL_PATCH are required when installing MySQL"
  exit 1
fi

MYSQL_VER="$MYSQL_MAJOR.$MYSQL_MINOR-$MYSQL_PATCH"
MYSQL_NAME="mysql-apt-config_0.${MYSQL_VER}_all.deb"

echo "Installing MySQL $MYSQL_VER"

wget https://repo.mysql.com/$MYSQL_NAME
sudo dpkg -i $MYSQL_NAME
sudo apt-get update -q
sudo apt-get install -q -y --allow-unauthenticated -o Dpkg::Options::=--force-confnew mysql-server
sudo systemctl restart mysql
# mysql < 8.0
sudo mysql_upgrade
# msql >= 8.0
#mysqladmin -u root -p shutdown
sudo systemctl stop mysql
sudo mysqld_safe --user=mysql --datadir=/usr/local/mysql --upgrade=FORCE &
sudo systemctl start mysql
mysql --version

echo "Installed MySQL $MYSQL_VER"