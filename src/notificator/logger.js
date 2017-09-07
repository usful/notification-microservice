const Winston = require('winston');
const config = require('../config');

const logger = new Winston.Logger({
  transports: [
    new Winston.transports.Console({
      level: config.notificator.logLevel,
      json: false,
      colorize: true,
      humanReadableUnhandledException: true,
      prettyPrint: true,
      // handleExceptions: true,
    }),
  ],
});

module.exports = logger;
