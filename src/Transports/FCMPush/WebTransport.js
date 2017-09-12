const admin = require('firebase-admin');
const Transport = require('../TransportBase');

module.exports = class WebTransport extends Transport {
  constructor(config) {
    super(config);

    if (admin.apps.length === 0) {
      const serviceAccount = require(config.transports.push.serviceAccountKeyPath);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: config.transports.push.dbUrl,
      });
    }
  }

  async send({ user, message }) {
    await admin.messaging().sendToDevice(user.web, message, this.config.transports.push.messagingOptions);
  }
};
