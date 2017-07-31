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

class Server {
  constructor(config) {
    configStore.update(_.merge(defaultConfig, config));
    this.server = null;
  }

  /** Connect to db and start api server **/
  async start() {
    dbClient.connect(configStore.config.dbConnection);
    this.server = await server.asyncListen(configStore.config.port);
    logger.info(`notifications-microservice listening on ${configStore.config.port}`);
  }

  stop() {
    // TODO: stop server
  }
}

module.exports = Server;
