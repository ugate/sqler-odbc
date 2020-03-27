-- When using a single statement BEGIN/END can be omitted
  BEGIN
    UPDATE TEST
    SET NAME = :name, UPDATED_AT = :updated
    WHERE ID = :id;
  END;
  BEGIN
    UPDATE TEST2
    SET NAME = :name2, UPDATED_AT = :updated2
    WHERE ID = :id2
  END;
END;