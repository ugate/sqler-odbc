CREATE TABLE "dbo.TEST" ("ID" integer not null primary key, "NAME" varchar(255), "CREATED_AT" datetime2, "UPDATED_AT" datetime2);
CREATE TABLE "dbo.TEST2" ("ID" integer not null primary key, "NAME" varchar(255), "REPORT" varbinary(max), "CREATED_AT" datetime2, "UPDATED_AT" datetime2);