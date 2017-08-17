const Transport = require('../Transport');
const twilio = require('twilio'); //kill timer interval needs to be larger than 300

module.exports = class SMSTransport extends Transport {
  constructor(config) {
    super(config);
    this.client = twilio(config.twilio.accountSid,config.twilio.authToken);
  }

  async send({ user, message }) {
    this.client.messages.create({
      body: message.body,
      to: user.sms,
      from: this.config.twilio.from,
    });
  }
};
