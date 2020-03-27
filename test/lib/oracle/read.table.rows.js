'use strict';

const Fs = require('fs');
const Os = require('os');

// export just to illustrate module usage
module.exports = async function runExample(manager, connName) {

  const rslt = await manager.db[connName].read.table.rows({ binds: { name: 'table' } });

  return rslt;
};