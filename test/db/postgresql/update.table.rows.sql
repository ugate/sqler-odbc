CREATE PROCEDURE sqlerodbc.perform_test_updates
(
  IN p_id INTEGER, IN p_name VARCHAR(255), IN p_updated TIMESTAMP,
  IN p_id2 INTEGER, IN p_name2 VARCHAR(255), IN p_updated2 TIMESTAMP
)
BEGIN
  /*
  Stored procedure is not required when executing a single SQL statement
  Also, MySQL doesn't support anonymous stored procedure blocks
  So, a temporary stored procedure is used instead
  */
  UPDATE sqlerodbc.TEST
  SET NAME = p_name, UPDATED_AT = CAST(p_updated AS DATETIME(3))
  WHERE ID = p_id;
  UPDATE sqlerodbc.TEST2
  SET NAME = p_name2, UPDATED_AT = CAST(p_updated2 AS DATETIME(3))
  WHERE ID = p_id2;
END;
CALL sqlerodbc.perform_test_updates(
  :id, :name, :updated,
  :id2, :name2, :updated2
);
DROP PROCEDURE sqlerodbc.perform_test_updates;