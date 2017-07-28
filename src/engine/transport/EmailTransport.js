const nodemailer = require('nodemailer');
const Transport = require('./TransportBase');

export default class EmailTransport extends Transport {
  constructor(config) {
    super(config);
    
    // put in the actual config here.
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: true,
      auth: {
        user: config.username,
        pass: config.password
      }
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
  
  async send({ user, data }) {
    await this.sendMail({
      from: this.config.from,
      to: user.email,
      subject: data.subject,
      text: data.text,
      html: data.html
    })
  }
}
