const nodemailer = require('nodemailer');
const aws = require('aws-sdk');
const Transport = require('../../classes/Transport');

module.exports = class EmailTransport extends Transport {
  constructor(config) {
    super(config);

    aws.config.update(config.transports.email);

    // put in the actual config here.
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
      from: this.config.from,
      to: user.email,
      subject: message.subject,
      text: message.text,
      html: message.html
    });
  }
};
