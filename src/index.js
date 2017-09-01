const API = require('./api');
const Notificator = require('./notificator');

const notificator = new Notificator();
notificator.init();

const api = new API();

notificator.run()
  .then(() => console.log('notificator stopped'))
  .catch((error) => console.error('[Error] notificator error', error));

api.start();
