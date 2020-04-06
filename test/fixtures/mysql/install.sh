#!/bin/bash -e

# ------------------- MySQL -------------------

RED='\033[0;31m'
GRAY='\033[0;37m'
NO_COLOR='\033[0m'

if [[ -z "${MYSQL_MAJOR}" || -z "${MYSQL_MINOR}" || -z "${MYSQL_PATCH}" ]]; then
  echo "${RED}Environmental variables MYSQL_MAJOR, MYSQL_MINOR and MYSQL_PATCH are required when installing MySQL${NO_COLOR}"
  exit 1
fi

MYSQL_VER="$MYSQL_MAJOR.$MYSQL_MINOR-$MYSQL_PATCH"
MYSQL_NAME="mysql-apt-config_0.${MYSQL_VER}_all.deb"

echo "${GRAY}Installing MySQL $MYSQL_VER ${NO_COLOR}"

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

echo "${GRAY}Installed MySQL $MYSQL_VER ${NO_COLOR}"