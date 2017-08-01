const Winston = require('winston');

const logger = new Winston.Logger({
  transports: [
    new Winston.transports.Console({
      level: 'debug', // Level for development
      handleExceptions: true,
      json: false,
      colorize: true,
      prettyPrint: true,
      humanReadableUnhandledException: true,
    }),
  ],
});

module.exports = logger;
