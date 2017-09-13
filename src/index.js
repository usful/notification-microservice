const { API, library } = require('./api');
const Notificator = require('./notificator');

class NotificationService {
  constructor() {
    const notificator = new Notificator();
    notificator.init();

    const api = new API();

    notificator
      .run()
      .then(() => console.log('notificator stopped'))
      .catch(error => console.error('[Error] notificator error', error));

    api.start();

    return library;
  }
}

module.exports = NotificationService;
