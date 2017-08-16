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
  aws: {
    ses: {
      from: 'info@joinlane.com',
      accessKeyId: process.env.accessKeyId,
      secretAccessKey: process.env.secretAccessKey,
    }
  },
  twilio: {
    accountSid: process.env.accountSid,
    authToken: process.env.authToken,
    from: process.env.twilio_Num
  }
};
