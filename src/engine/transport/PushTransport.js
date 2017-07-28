const Transport = require('../../classes/Transport');

module.exports = class PushTransport extends Transport {
  constructor(config) {
    super(config);
  }

  async send({ user, message }) {
    console.log('Push Transport', user.id, message);
  }
};
