CREATE PROCEDURE sqlerodbc.perform_test_inserts
(
  IN p_id INTEGER, IN p_name VARCHAR(255)
)
BEGIN
  PREPARE stmt1 FROM 'INSERT INTO sqlerodbc.TEST (`ID`, `NAME`) VALUES (?, ?)';
  EXECUTE stmt1 USING @p_id, @p_name;
  DEALLOCATE PREPARE stmt1;
  PREPARE stmt2 FROM 'INSERT INTO sqlerodbc.TEST2 (`ID`, `NAME`) VALUES (1, ''TEST'')';
  EXECUTE stmt2;
  DEALLOCATE PREPARE stmt2;
END;
CALL sqlerodbc.perform_test_inserts(:id, :name);
DROP PROCEDURE sqlerodbc.insert_ten_rows;