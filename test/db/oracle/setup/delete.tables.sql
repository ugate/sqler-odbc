-- When using a single statement only the statement inside the single quotes needs to exist in the SQL file
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE TEST';
  EXECUTE IMMEDIATE 'DROP TABLE TEST2';
END;