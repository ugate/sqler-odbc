CREATE DATABASE IF NOT EXISTS sqlerodbc;
CREATE TABLE IF NOT EXISTS sqlerodbc.TEST (ID INTEGER NOT NULL PRIMARY KEY, NAME VARCHAR(255), CREATED_AT DATETIME(3), UPDATED_AT DATETIME(3));
CREATE TABLE IF NOT EXISTS sqlerodbc.TEST2 (ID INTEGER NOT NULL PRIMARY KEY, NAME VARCHAR(255), REPORT BLOB, CREATED_AT DATETIME(3), UPDATED_AT DATETIME(3));