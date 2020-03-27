-- When using a single statement BEGIN/END can be omitted
  BEGIN
    DELETE FROM TEST TST
    WHERE TST.ID = :id;
  END;
  BEGIN
    DELETE FROM TEST2 TST
    WHERE TST.ID = :id2;
  END;
END;