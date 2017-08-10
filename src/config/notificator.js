const { getAssert } = require('../lib/util');

module.exports = {
  logLevel: getAssert(process.env.NOTI_LOG_LEVEL),
  maxWorkers: parseInt(getAssert(process.env.NOTI_WORKERS)),
  getDataPollInterval: parseInt(getAssert(process.env.NOTI_GET_DATA_POLL_INTERVAL)),
  getDataPollSleep: parseInt(getAssert(process.env.NOTI_GET_DATA_POLL_SLEEP)),
  getNextWorkerPollInterval: parseInt(getAssert(process.env.NOTI_GET_NEXT_WORKER_POLL_INTERVAL)),
  workerDeadlockTimeout: parseInt(getAssert(process.env.NOTI_WORKER_DEADLOCK_TIMEOUT)),
  workerPingInterval: parseInt(getAssert(process.env.NOTI_WORKER_PING_INTERVAL)),

  // transports: {
  //   email: {
  //     AWSAccessKeyID: 'key',
  //     AWSSecretKey: 'secret',
  //     region: 'us-east-1',
  //     rateLimit: 5,
  //   },
  // },
  // AWS: {
  //   SQS: {
  //     BounceURL: 'bounceUrl',
  //     ComplaintsURL: 'complaintUrl',
  //   },
  // },
};
