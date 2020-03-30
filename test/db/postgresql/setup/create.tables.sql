CREATE DATABASE IF NOT EXISTS sqlerodbc;
CREATE TABLE IF NOT EXISTS sqlerodbc.TEST (ID integer not null primary key, NAME varchar(255), CREATED_AT timestamp, UPDATED_AT timestamp);
CREATE TABLE IF NOT EXISTS sqlerodbc.TEST2 (ID integer not null primary key, NAME varchar(255), REPORT blob, CREATED_AT timestamp, UPDATED_AT timestamp);