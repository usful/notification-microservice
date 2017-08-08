const Winston = require('winston');
const config = require('../config');

const logger = new Winston.Logger({
  transports: [
    new Winston.transports.Console({
      level: config.api.logLevel,
      // handleExceptions: true,
      json: false,
      colorize: true,
      prettyPrint: true,
      humanReadableUnhandledException: true,
    }),
  ],
});

module.exports = logger;
