'use strict';

// export just to illustrate module usage
module.exports = async function runExample(manager, connName) {

  // create multiple tables in a single execution
  const rslt = await manager.db[connName].setup.create.tables();

  return rslt;
};