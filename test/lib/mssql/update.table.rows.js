'use strict';

// export just to illustrate module usage
module.exports = async function runExample(manager, connName) {

  // The odbc module needs the date to be in a valid ANSI compliant format.
  // Could also use:
  // https://www.npmjs.com/package/moment-db
  const date = new Date().toISOString().replace('T', ' ').replace('Z', '');

  // Update rows into multiple tables within a single ODBC execution
  const rslt = await manager.db[connName].update.table.rows({
    binds: {
      id: 1, name: 'TABLE: 1, ROW: 1 (UPDATE)', updated: date,
      id2: 1, name2: 'TABLE: 2, ROW: 1 (UPDATE)', updated2: date
    }
  });

  return rslt;
};