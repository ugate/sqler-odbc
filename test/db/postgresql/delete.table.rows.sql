CREATE PROCEDURE sqlerodbc.perform_test_deletes
(
  IN p_id INTEGER, IN p_id2 INTEGER
)
BEGIN
  /*
  Stored procedure is not required when executing a single SQL statement
  Also, MySQL doesn't support anonymous stored procedure blocks
  So, a temporary stored procedure is used instead
  */
  DELETE FROM sqlerodbc.TEST
  WHERE ID = :id;
  DELETE FROM sqlerodbc.TEST2
  WHERE ID = :id2;
END;
CALL sqlerodbc.perform_test_deletes(
  :id, :id2
);
DROP PROCEDURE sqlerodbc.perform_test_deletes;