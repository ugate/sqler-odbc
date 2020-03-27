-- When using a single statement BEGIN/END can be omitted
BEGIN
  BEGIN
    INSERT INTO TEST (ID, NAME, CREATED_AT, UPDATED_AT)
    VALUES (:id, :name, :created, :updated);
  END;
  BEGIN
    INSERT INTO TEST2 (ID, NAME, REPORT, CREATED_AT, UPDATED_AT)
    VALUES (:id2, :name2, :report2, :created2, :updated2);
  END;
END;