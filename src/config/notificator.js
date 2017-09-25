const { getAssert } = require('../lib/util');

module.exports = {
  maxWorkers: 2,
  getDataPollInterval: 500,
  getNextWorkerPollInterval: 100,
  workerDeadlockTimeout: 60000,
  workerPingInterval: 1000,
  logLevel: 'error',
};
