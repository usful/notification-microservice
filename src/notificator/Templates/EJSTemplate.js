const Template = require('../Template');
const ejs = require('ejs');
const _ = require('lodash');

module.exports = class EJSTemplate extends Template {
  constructor(id) {
    super(id);
  }

  async renderEmail({ user, data }) {
    await this.load();

    const template = this.template.email;
    return this.ejsRender(template,{user, notificationData:data});
  }

  async renderSMS({ user, data }) {
    await this.load();

    const template = this.template.sms;
    return this.ejsRender(template,{user, notificationData:data});
  }

  ejsRender(template,data) {
    return _.mapValues(template, (template_string) => {
      try {
        return ejs.render(template_string, data);
      }catch(error) {

      }
    });
  }
};
