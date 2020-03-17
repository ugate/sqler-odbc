'use strict';

const Fs = require('fs');

// export just to illustrate module usage
module.exports = async function runExample(manager, connName) {

  const rslt = await manager.db[connName].read.table.rows({ binds: { name: 'table' } });

  // write the report(s) to file?
  for (let row of rslt.rows) {
    if (row.report) {
      Fs.writeFileSync(`report-${row.id}.png`, row.report);
    }
  }

  return rslt;
};