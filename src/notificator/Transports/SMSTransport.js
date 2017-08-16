const Transport = require('./TransportBase');

module.exports = class SMSTransport extends Transport {
  constructor(config) {
    super(config);
  }
};
