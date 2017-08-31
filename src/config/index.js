/**
 * Reads .env.${NODE_ENV} file and put it in process.env
 */
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

if (!process.env.NODE_ENV) {
  throw new Error('[config] Please set NODE_ENV so we could load the env file with that name');
}
const envFile = path.resolve(__dirname, '../../env', `.env.${process.env.NODE_ENV}`);

try {
  console.log('loading config', envFile);
  fs.statSync(envFile);
  dotenv.load({ path: envFile });
} catch (error) {
  throw new Error(`[config] env file not found ${envFile}`);
}

module.exports = {
  db: require('./db'),
  api: require('./api'),
  notificator: require('./notificator'),
  transports: require('./transports'),
  sqs: {
    init_conf: {
      accessKeyId: process.env.TPS_EMAIL_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.TPS_EMAIL_AWS_SECRET_KEY,
      region: process.env.AWS_REGION,
      apiVersion: '2012-11-05',
    },
    pollingInterval: 1000,
    complaintQueue: process.env.SQS_COMPLAINTS,
    bounceQueue: process.env.SQS_BOUNCE,
    deliveredQueue: process.env.SQS_DELIVERED,
  }
};
