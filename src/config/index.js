/** Add your own server configuration here **/

const db = {
  dbConnection: {
    host: 'localhost',
    port: 5432,
    database: 'notifications_test',
    user: 'notificator',
    max: 10,
    idleTimeoutMillis: 30000,
  },
};

// TODO: use this config on api
const api = {
  port: 8080,
};

const notificator = {
  maxWorkers: 2,
  getDataPollInterval: 500,
  dbConnection: db.dbConnection,

  // deadlockTimeout: 1800000,
  // workerPingInterval: 1000,
  // controllerCheckInterval: 1000,
  // loadBalancerInterval: 20,
  // sqsPollingInterval: 1000,
  transports: {
    email: {
      AWSAccessKeyID: 'key',
      AWSSecretKey: 'secret',
      region: 'us-east-1',
      rateLimit: 5,
    },
  },
  AWS: {
    SQS: {
      BounceURL: 'bounceUrl',
      ComplaintsURL: 'complaintUrl',
    },
  },
};

module.exports = { api, notificator };
