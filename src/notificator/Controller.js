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
    const cConfig = Object.assign(
      {},
      {
        script: path.resolve(dirname, './Worker.js'),
      },
      config.notificator
    );
    // logger.debug('[Controller] constructor', cConfig);
    super(cConfig);
  }

  init() {
    dbClient.connect(config.db);
    this.launchWorkers();
  }

  async getData(controller) {
    while (controller.live) {
      logger.debug('[Notificator] querying for data...');
      const notification = await queries.getNextNotificationAndMarkAsProcessing();

      if (config.notificator.getDataPollSleep) {
        logger.warn('[Notificator] sleeping getData for', config.notificator.getDataPollSleep);
        await util.pause(config.notificator.getDataPollSleep);
      }

      if (notification) {
        return { notification };
      }

      logger.debug('[Notificator] data not found, sleeping for ', config.notificator.getDataPollInterval);
      await util.pause(config.notificator.getDataPollInterval);
    }
  }

  async postDataProcessSucess({ data: { notification } }) {
    await queries.markNotificationAsSent(notification.id);
    logger.info('[Notificator] notification sent', notification.id);
  }

  async postDataProcessFail({ data: { notifiation } }) {
    logger.info('[Notificator] postDataProcessFail', data);
    await queries.markNotificationAsFail(notification.id);
  }
}

module.exports = Controller;
