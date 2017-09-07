const nodemailer = require('nodemailer');
const aws = require('aws-sdk');
const Transport = require('../TransportBase');

module.exports = class EmailTransport extends Transport {
  constructor(config) {
    super(config);

    // put in the actual config here.
    aws.config.update({
      accessKeyId: config.transports.email.AWSAccessKeyID,
      secretAccessKey: config.transports.email.AWSSecretKey,
      region: config.transports.email.region,
    });

    this.transporter = nodemailer.createTransport({
      SES: new aws.SES({ apiVersion: '2010-12-01' })
    });
  }

  /**
   * Wrap the nodemailer sendMail in a promise to allow async/await
   * @param mailOptions
   * @returns {Promise}
   */
  sendMail(mailOptions) {
    return new Promise((resolve, reject) => {
      // send mail with defined transport object
      this.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(info);
      });
    });
  }

  async send({ user, message }) {
    await this.sendMail({
      from: this.config.transports.email.from,
      to: user.email,
      subject: message.subject,
      text: message.text,
      html: message.html
    });
  }
};
