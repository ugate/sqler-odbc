SELECT DP.ID AS "id", DP.LabDeptCode AS "code", DP.LabDeptName AS "name"
FROM SITE.MA_LabDept DP
WHERE UPPER(DP.LabDeptName) LIKE UPPER('%' || :labDeptName || '%')
ORDER BY DP.LabDeptName ASC