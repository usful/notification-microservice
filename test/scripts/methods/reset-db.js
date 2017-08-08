const path = require('path');
const { exec } = require('child_process');

const dirname = __dirname;

module.exports = async function resetDB() {
  return new Promise((resolve, reject) => {
    exec(
      `sh ${path.resolve(dirname, '../../../src/database/recreate-db.sh')} notifications_test notificator`,
      (error, stdout, stderr) => {
        console.log('[reset-db] database re-created');
        if (error !== null) {
          reject(error);
          return;
        }
        resolve();
      }
    );
  });
};
