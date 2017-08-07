const Winston = require('winston');

const logger = new Winston.Logger({
  transports: [
    new Winston.transports.Console({
      level: 'debug', // Level for development
      json: false,
      colorize: true,
      humanReadableUnhandledException: true,
      prettyPrint: true,
      // handleExceptions: true,
    }),
  ],
});

module.exports = logger;
