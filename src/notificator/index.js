//module.exports = require('./Controller');
const Controller = require('./Controller');
const WebHookHandler = require('./WebhookHandler');

const webhookHandlers = {
  NotificationFailed: new WebHookHandler('NotificationFailed'),
  NotificationSuccess: new WebHookHandler('NotificationSuccess'),
  UserDeliveryFailed: new WebHookHandler('UserDeliveryFailed')
};

class Notificator {

  constructor() {
    this.controller = new Controller();
  }

  init() {
    this.controller.init({

    });
  }

  async run() {
    this.controller.run();
  }
}