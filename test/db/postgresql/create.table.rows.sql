CREATE PROCEDURE sqlerodbc.perform_test_inserts
(
  IN p_id INTEGER, IN p_name VARCHAR(255), IN p_created TIMESTAMP, IN p_updated TIMESTAMP,
  IN p_id2 INTEGER, IN p_name2 VARCHAR(255), IN p_report2 BLOB, IN p_created2 TIMESTAMP, IN p_updated2 TIMESTAMP
)
BEGIN
  /*
  Stored procedure is not required when executing a single SQL statement
  Also, MySQL doesn't support anonymous stored procedure blocks
  So, a temporary stored procedure is used instead
  */
  INSERT INTO sqlerodbc.TEST (`ID`, `NAME`, CREATED_AT, UPDATED_AT)
  VALUES (p_id, p_name, CAST(p_created AS DATETIME(3)), CAST(p_updated AS DATETIME(3)));
  INSERT INTO sqlerodbc.TEST2 (`ID`, `NAME`, REPORT, CREATED_AT, UPDATED_AT)
  VALUES (p_id2, p_name2, p_report2, CAST(p_created2 AS DATETIME(3)), CAST(p_updated2 AS DATETIME(3)));
END;
CALL sqlerodbc.perform_test_inserts(
  :id, :name, :created, :updated,
  :id2, :name2, :report2, :created2, :updated2
);
DROP PROCEDURE sqlerodbc.perform_test_inserts;