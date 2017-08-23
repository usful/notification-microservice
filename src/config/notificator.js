const { getAssert } = require('../lib/util');

module.exports = {
  maxWorkers: getAssert(process.env.NOTI_WORKERS),
  getDataPollInterval: getAssert(process.env.NOTI_GET_DATA_POLL_INTERVAL),
  getNextWorkerPollInterval: getAssert(process.env.NOTI_GET_NEXT_WORKER_POLL_INTERVAL),
  workerDeadlockTimeout: getAssert(process.env.NOTI_WORKER_DEADLOCK_TIMEOUT),
  workerPingInterval: getAssert(process.env.NOTI_WORKER_PING_INTERVAL),
  logLevel: getAssert(process.env.NOTI_LOG_LEVEL),
};
