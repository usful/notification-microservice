const { getAssert } = require('../lib/util');

module.exports = {
  host: getAssert(process.env.DB_HOST),
  port: getAssert(process.env.DB_PORT),
  database: getAssert(process.env.DB_NAME),
  user: getAssert(process.env.DB_USER),
};
