'use strict';

// export just to illustrate module usage
module.exports = async function runExample(manager, connName) {

  // begin tranaction
  const txId = await manager.db[connName].beginTransaction();
  
  let exec1, exec2;
  try {
    // set the transaction ID on the execution options
    // so the SQL executions are invoked within the
    // same transaction scope from the connection pool

    // execute within a transaction scope, but don't commit
    // (i.e. autoCommit === false and transactionId = txId)
    exec1 = await manager.db[connName].site.create.lab.departments({
      autoCommit: false,
      transactionId: txId,
      binds: {
        id: 1,
        name: 'Blood Bank',
        code: 'BB'
      }
    });

    // execute within the same transaction scope
    // and commit after the satement has executed
    // (i.e. autoCommit === true and transactionId = txId)
    exec2 = await manager.db[connName].site.create.lab.departments({
      autoCommit: true,
      transactionId: txId,
      binds: {
        id: 2,
        name: 'Blood Bank Send Out',
        code: 'BBSO'
      }
    });
  } catch (err) {
    if (exec1) {
      // can rollback using either exc1.rollback() or exc2.rollback()
      await exc1.rollback();
    }
  }

  // return the results
  return {
    dept1: exec1 && exec1.rows,
    dept2: exec2 && exec2.rows
  };
};