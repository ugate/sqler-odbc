#!/bin/bash -e

# ------------------- MySQL -------------------

MYSQL_MAJOR="8"
MYSQL_MINOR="14"
MYSQL_PATCH="1"
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

# ------------------- MySQL ODBC Drivers (Ubuntu) -------------------

# Ubuntu version needs to match the distibution being used
MYSQL_UBUNTU_VER=`lsb_release -sr`
MYSQL_UBUNTU_VER=`echo $MYSQL_UBUNTU_VER | sed -e 's/^[[:space:]]*//'`

MYSQL_ODBC_MAJOR="8"
MYSQL_ODBC_MINOR="0"
MYSQL_ODBC_PATCH="19"
MYSQL_ODBC_VER="$MYSQL_ODBC_MAJOR.$MYSQL_ODBC_MINOR.$MYSQL_ODBC_PATCH"
MYSQL_ODBC_NAME="mysql-connector-odbc-$MYSQL_ODBC_VER-linux-ubuntu$MYSQL_UBUNTU_VER-x86-64bit"

echo "Installing MySQL ODBC driver $MYSQL_ODBC_VER"

# get and extract the driver
wget -O mysql-odbc.tar.gz -nv https://dev.mysql.com/get/Downloads/Connector-ODBC/$MYSQL_ODBC_MAJOR.$MYSQL_ODBC_MINOR/$MYSQL_ODBC_NAME.tar.gz
tar -xvf mysql-odbc.tar.gz
# copy the driver libs
sudo cp $MYSQL_ODBC_NAME/lib/libmyodbc$MYSQL_ODBC_MAJOR* /usr/lib/x86_64-linux-gnu/odbc/

MYSQL_ODBC_DRIVER="/usr/lib/x86_64-linux-gnu/odbc/libmyodbc${MYSQL_ODBC_MAJOR}w.so"
MYSQL_ODBC_DRIVER_FOUND=`[[ (-f "$MYSQL_ODBC_DRIVER") ]] && echo "Found: $MYSQL_ODBC_DRIVER" || echo "Cannot find: $MYSQL_ODBC_DRIVER"`
echo $MYSQL_ODBC_DRIVER_FOUND

# install the driver
sudo $MYSQL_ODBC_NAME/bin/myodbc-installer -a -d -n "MySQL ODBC ${MYSQL_ODBC_MAJOR} Driver" -t "DRIVER=$MYSQL_ODBC_DRIVER;"

# install the data source
sudo $MYSQL_ODBC_NAME/bin/myodbc-installer -s -a -c2 -n "MySQL" -t "DRIVER=MySQL;SERVER=127.0.0.1;DATABASE=mysql;UID=root;PWD="

echo "Installed MySQL ODBC driver $MYSQL_ODBC_VER"