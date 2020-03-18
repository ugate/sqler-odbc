'use strict';

const Fs = require('fs');
const Os = require('os');

// export just to illustrate module usage
module.exports = async function runExample(manager, connName) {

  const rslt = await manager.db[connName].read.table.rows({ binds: { name: 'table' } });

  // write the report(s) to file?
  let report;
  for (let row of rslt.rows) {
    if (row.report) {
      report = Buffer.from(row.report, 'binary');
      await Fs.promises.writeFile(`${Os.tmpdir()}/sqler-odbc-${connName}-read-${row.id}.png`, report);
    }
  }

  return rslt;
};