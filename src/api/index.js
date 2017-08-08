const _ = require('lodash');
const logger = require('./logger');
const server = require('./server');
const dbClient = require('../database/poolClient');
const config = require('../config');

class Server {
  constructor() {
    this.server = null;
  }

  /** Connect to db and start api server **/
  async start() {
    dbClient.connect(config.db);
    this.server = await server.asyncListen(config.api.port);

    // Custom parsing for enums
    const enums = await dbClient.db.many(
      `
      SELECT typname, oid, typarray
      FROM pg_type
      WHERE
      (
        typname = 'verification_status' OR
        typname = 'delivery_type' OR
        typname = 'notification_status'
      ) AND
      typarray <> 0
      ORDER by oid
      `
    );
    enums.forEach((en) => dbClient.addArrayParser(en.typarray));
    logger.info(`notifications-microservice listening on ${config.api.port}`);
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
