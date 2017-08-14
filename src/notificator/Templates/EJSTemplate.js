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
    return _.mapValues(template, (template_string) => {
      try {
        return ejs.render(template_string, {user, notificationData:data});
      }catch(error) {

      }
    });
  }

  async renderPush({ user, data }) {

  }

  async rednerSMS({ user, data }) {
    await this.load();

  }
};
