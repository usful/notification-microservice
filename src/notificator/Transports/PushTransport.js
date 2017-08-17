const Transport = require('../Transport');
const admin = require('firebase-admin');

module.exports = class PushTransport extends Transport {
  constructor(config) {
    super(config);

    const serviceAccount = require(config.fcm.serviceAccountKeyPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: config.fcm.dbUrl,
    });
  }

  async send({ user, message }) {
    await admin.messaging().sendToDevice(user.push, message, this.config.fcm.messagingOptions);
  }
};
