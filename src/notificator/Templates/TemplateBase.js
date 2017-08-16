const poolClient = require('../../database/poolClient');
const config = require('../../config/index');
poolClient.connect(config.db);
const db = poolClient.db;

module.exports = class Template {
  constructor(id) {
    this.id = id;
    this.load();
  }

  async load() {
    if (!this.template) {
      this.template = await db.oneOrNone(
        `SELECT * FROM template WHERE id = $1`,
        this.id
      );
    }
  }

  async renderWeb({ user, data }) {
    await this.load();

    return Object.assign({}, this.template.web);
  }

  async renderPush({ user, data }) {
    await this.load();

    return Object.assign({}, this.template.push);
  }

  async renderVoice({ user, data }) {
    await this.load();

    return Object.assign({}, this.template.voice);
  }

  async renderSms({ user, data }) {
    await this.load();

    return Object.assign({}, this.template.sms);
  }

  async renderEmail({ user, data }) {
    await this.load();

    return Object.assign({}, this.template.email);
  }

  async render({ delivery, user, data }) {
    await this.load();

    // TODO: use the constants here?
    switch (delivery) {
      case 'sms':
        return this.renderSms({ user, data });
      case 'voice':
        return this.renderVoice({ user, data });
      case 'push':
        return this.renderPush({ user, data });
      case 'web':
        return this.renderWeb({ user, data });
      case 'email':
        return this.renderEmail({ user, data });
    }
  }
};
