const _ = require('lodash');
const logger = require('./logger');
const configStore = require('./configStore');
const server = require('./server');
const dbClient = require('../database/poolClient');

const defaultConfig = {
  port: 8080,
  dbConnection: {
    host: 'localhost',
    port: 5432,
    database: 'notifications',
    user: 'notificator',
    max: 10,
    idleTimeoutMillis: 30000,
  },
};

// if (process.env.LOG_LEVEL) {
//   // console.log('setting log level to', process.env.LOG_LEVEL);
//   //console.log(logger.transports); ??
//   //logger.default.transports.console.level = process.env.LOG_LEVEL;
// }

class Server {
  constructor(config) {
    configStore.update(_.merge(defaultConfig, config));
    this.server = null;

    if (config.logLevel) {
      console.log('[api] setting log level to', config.logLevel);
      logger.transports.console.level = config.logLevel;
    }
  }

  /** Connect to db and start api server **/
  async start() {
    dbClient.connect(configStore.config.dbConnection);
    this.server = await server.asyncListen(configStore.config.port);
    logger.info(`notifications-microservice listening on ${configStore.config.port}`);
  }

  /** Stop koa server and close database connections **/
  stop() {
    return new Promise((resolve, reject) => {
      this.server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        dbClient.end();
        resolve();
      });
    });
  }
}

module.exports = Server;
