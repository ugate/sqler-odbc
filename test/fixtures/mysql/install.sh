#!/bin/bash -e

export MYSQL_MAJOR="8"
export MYSQL_MINOR="14"
export MYSQL_PATCH="1"
export MYSQL_VER="$MYSQL_MAJOR.$MYSQL_MINOR-$MYSQL_PATCH"
export MYSQL_NAME="mysql-apt-config_0.${MYSQL_VER}_all.deb"

echo "Installing MySQL $MYSQL_VER"

wget https://repo.mysql.com/$MYSQL_NAME
sudo dpkg -i $MYSQL_NAME
sudo apt-get update -q
sudo apt-get install -q -y --allow-unauthenticated -o Dpkg::Options::=--force-confnew mysql-server
sudo systemctl restart mysql
sudo mysql_upgrade
mysql --version

echo "Installed MySQL $MYSQL_VER"

export MYSQL_ODBC_MAJOR="8"
export MYSQL_ODBC_MINOR="0"
export MYSQL_ODBC_PATCH="19"
export MYSQL_ODBC_VER="$MYSQL_ODBC_MAJOR.$MYSQL_ODBC_MINOR.$MYSQL_ODBC_PATCH"
export MYSQL_ODBC_NAME="mysql-connector-odbc-$MYSQL_ODBC_VER-linux-ubuntu$MYSQL_ODBC_UBUNTU_VER-x86-64bit"

echo "Installing MySQL ODBC driver $MYSQL_ODBC_VER"

# get and extract the driver
wget -O mysql-odbc.tar.gz -nv https://dev.mysql.com/get/Downloads/Connector-ODBC/$MYSQL_ODBC_MAJOR.$MYSQL_ODBC_MINOR/$MYSQL_ODBC_NAME.tar.gz
tar -xvf mysql-odbc.tar.gz
# copy the driver libs
sudo cp $MYSQL_ODBC_NAME/lib/libmyodbc$MYSQL_ODBC_MAJOR* /usr/lib/x86_64-linux-gnu/odbc/
# install the driver
sudo $MYSQL_ODBC_NAME/bin/myodbc-installer -d -a -n "MySQL" -t "DRIVER=/usr/lib/x86_64-linux-gnu/odbc/libmyodbc${MYSQL_ODBC_MAJOR}w.so;"
# install the data source
sudo $MYSQL_ODBC_NAME/bin/myodbc-installer -s -a -c2 -n "MySQL" -t "DRIVER=MySQL;SERVER=127.0.0.1;DATABASE=mysql;UID=root;PWD="

echo "Installed MySQL ODBC driver $MYSQL_ODBC_VER"