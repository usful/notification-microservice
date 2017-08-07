const path = require('path');
const _ = require('lodash');
const BaseController = require('./Tasker/Controller');
const queries = require('./queries');
const logger = require('./logger');
const config = require('../config').notificator;
const util = require('../lib/util');
const dbClient = require('../database/poolClient');

const dirname = __dirname;

class Controller extends BaseController {
  constructor() {
    const cConfig = _.merge({}, config, {
      script: path.resolve(dirname, './Worker.js'),
    });
    // logger.info('[Controller] constructor', cConfig);
    super(cConfig);
    this.config = cConfig;

    //this.getData = this.getData.bind(this);
    this.init = this.init.bind(this);
  }

  init() {
    dbClient.connect(this.config.dbConnection);
    this.launchWorkers();
  }

  async getData(controller) {
    while (controller.live) {
      logger.info('[Notificator] querying for data...');
      const notification = await queries.getNextNotificationAndMarkAsProcessing();

      if (notification) {
        return { notification };
      }

      logger.info('[Notificator] data not found, sleeping for ', this.config.getDataPollInterval);
      await util.pause(this.config.getDataPollInterval);
    }
  }
}

module.exports = Controller;
