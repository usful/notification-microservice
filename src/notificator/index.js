//module.exports = require('./Controller');
const Controller = require('./Controller');
const WebHookHandler = require('./WebhookHandler');

const webhookHandlers = {
  NotificationFailed: new WebHookHandler('NotificationFailed'),
  NotificationSuccess: new WebHookHandler('NotificationSuccess'),
  UserDeliveryFailed: new WebHookHandler('UserDeliveryFailed'),
  UserDeliveryConfirmed: new WebHookHandler('UserDeliveryConfirmed'),
  SystemError: new WebHookHandler('SystemError')
};

class Notificator {

  constructor() {
    this.controller = new Controller();
  }

  init() {
    this.controller.init();
    this.controller.on('fireWebhook', (eventString, data = {}) => {
      webhookHandlers[eventString].fire(data);
    });
  }

  async run() {
    await this.controller.run()
      .then(() => console.log('controller stopped'))
      .catch((error) => console.error('[Error] controller error', error));
  }
}

module.exports = Notificator;