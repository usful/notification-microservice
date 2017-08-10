const { getAssert } = require('../lib/util');

module.exports = {
  port: getAssert(process.env.API_PORT),
  logLevel: getAssert(process.env.API_LOG_LEVEL),
};
