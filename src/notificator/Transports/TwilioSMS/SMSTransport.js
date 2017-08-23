const twilio = require('twilio'); //kill timer interval needs to be larger than 300
const Transport = require('../TransportBase');

module.exports = class SMSTransport extends Transport {
  constructor(config) {
    super(config);
    this.client = twilio(config.transports.sms.accountSid, config.transports.sms.authToken);
  }

  async send({ user, message }) {
    await this.client.messages.create({
      body: message.body,
      to: user.sms,
      from: this.config.twilio.from,
    });
  }
};
