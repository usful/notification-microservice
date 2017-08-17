const Template = require('./TemplateBase');
const ejs = require('ejs');
const _ = require('lodash');

module.exports = class EJSTemplate extends Template {
  constructor(id, dbClient) {
    super(id, dbClient);
  }

  renderEmail({ user, data }) {
    const template = this.template.email;

    // TODO: This means that we assume all key-values in template are ejs valid templates, but the template creation
    //       is not validated like that
    return _.mapValues(template, template_string => {
      try {
        return ejs.render(template_string, { user, data });
      } catch (error) {
        // TODO: Format error for upper detection
        throw error;
      }
    });
  }
};
