const Template = require('../../classes/Template');
const ejs = require('ejs');

module.exports = class EJSTemplate extends Template {
  constructor(id) {
    super(id);
  }

  async renderEmail({ user, data }) {
    await this.load();

    // TODO: implement ejs templating.

    return {
      ...this.template.email
    };
  }
};
