/** Userland **/

const Notificator = require('../../src/notificator');

const notificator = new Notificator();
notificator.init();
notificator.run()
.then(() => console.log('notificator stoped'))
.catch((error) => console.error('[Error] notificator error', error));

// engine.stop();
