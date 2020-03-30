'use strict';

// export just to illustrate module usage
module.exports = async function runExample(manager, connName) {

  // execute the SQL statement and capture the results
  const rslt = await manager.db[connName].site.read.lab.departments({
    binds: {
      labDeptName: 'Blood'
    }
  });

  return rslt;
};