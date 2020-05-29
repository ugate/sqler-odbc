CREATE SCHEMA IF NOT EXISTS sqlerodbc;
CREATE TABLE IF NOT EXISTS sqlerodbc.TEST (ID INTEGER NOT NULL PRIMARY KEY, NAME VARCHAR(384), CREATED_AT TIMESTAMP(3) WITH TIME ZONE, UPDATED_AT TIMESTAMP(3) WITH TIME ZONE);
CREATE TABLE IF NOT EXISTS sqlerodbc.TEST2 (ID INTEGER NOT NULL PRIMARY KEY, NAME VARCHAR(384), REPORT BYTEA, CREATED_AT TIMESTAMP(3) WITH TIME ZONE, UPDATED_AT TIMESTAMP(3) WITH TIME ZONE);