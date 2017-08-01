const path = require('path');
const { exec } = require('child_process');

module.exports = async function resetDB() {
  console.log('running resetdb from ', path.resolve(__dirname));

  return new Promise((resolve, reject) => {
    exec(
      `sh ${path.resolve(__dirname, '../src/database/recreate-db.sh')} notifications-test notificator`,
      (error, stdout, stderr) => {
        console.log(stdout);
        if (error !== null) {
          reject(error);
          return;
        }
        resolve();
      }
    );
  });
};
