const Template = require('./TemplateBase');
const ejs = require('ejs');
const _ = require('lodash');

module.exports = class EJSTemplate extends Template {
  constructor(id, dbClient) {
    super(id, dbClient);
  }

  renderEmail({ user, data }) {
    const template = this.template.email;
    return this.ejsRender(template, { user, data });
  }

  renderSMS({ user, data }) {
    const template = this.template.sms;
    return this.ejsRender(template, { user, data });
  }

  renderPush({ user, data }) {
    data = data || {};
    const template = this.template.push;
    /*
      With this implementation push data is loaded into the returned message by the ejsTemplate from the data object
      passed in with the notification. If pushData isn't specified then its set as an empty object. Requires the
      data parameter to never be null. Could change schema to set data of notification to NOT NULL
     */
    return {
      notification: this.ejsRender(template, { user, data }),
      data: data.pushData || {},
    };
  }

  /**
   *  ejsRender can now render templates with multiple layers, and can render strings in arrays as well.
   * @param template
   * @param data
   * @returns {Object}
   */
  ejsRender(template, data) {
    return _.mapValues(template, value => {
      try {
        if (typeof value === 'object') {
          if (Array.isArray(value)) {
            return value.map(elem => {
              return ejs.render(elem, data);
            });
          }
          return this.ejsRender(value, data);
        }
        return ejs.render(value, data);
      } catch (error) {
        console.log(error);
      }
    });
  }
};
