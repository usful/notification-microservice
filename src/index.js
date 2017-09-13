const API = require('./api');
const API_LIB = require('./api/lib');
const Notificator = require('./notificator');

class NotificationService {

  constructor() {
    this.notificator = new Notificator();
    this.notificator.init();

    this.api = new API();

    this.notificator.run()
      .then(() => console.log('notificator stopped'))
      .catch((error) => console.error('[Error] notificator error', error));

    this.api.start();

    for (let key in API_LIB) {
      this[key] = API_LIB[key];
    }
  };
}

module.exports = NotificationService;