const path = require('path');
const BaseController = require('./Tasker/Controller');
const queries = require('./queries');
const logger = require('./logger');
const config = require('../config');
const util = require('../lib/util');
const dbClient = require('../database/poolClient');

const dirname = __dirname;

class Controller extends BaseController {
  constructor() {
    const cConfig = Object.assign({}, {
      script: path.resolve(dirname, './Worker.js'),
    }, config.notificator);

    // logger.info('[Controller] constructor', cConfig);
    super(cConfig);
  }

  init() {
    dbClient.connect(config.db);
    this.launchWorkers();
  }

  async getData(controller) {
    while (controller.live) {
      logger.info('[Notificator] querying for data...');
      const notification = await queries.getNextNotificationAndMarkAsProcessing();

      if (notification) {
        return { notification };
      }

      logger.info('[Notificator] data not found, sleeping for ', config.notificator.getDataPollInterval);
      await util.pause(config.notificator.getDataPollInterval);
    }
  }

  // TODO: Bring back managing failed notifications
}

module.exports = Controller;
