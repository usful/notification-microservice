
module.exports = class Template {
  constructor(id, dbClient) {
    this.id = id;
    this.dbClient = dbClient;
  }

  async load() {
    this.template = await this.dbClient.db.oneOrNone(
      `SELECT * FROM template WHERE id = $1`,
      this.id
    );
    if (!this.template) {
      throw new Error(`[Template] template id ${this.id} not found`);
    }
  }

  async renderWeb({ user, data }) {
    throw new Error('Template base render functions need to be extended');
  }

  async renderPush({ user, data }) {
    throw new Error('Template base render functions need to be extended');
  }

  async renderVoice({ user, data }) {
    throw new Error('Template base render functions need to be extended');
  }

  async renderSms({ user, data }) {
    throw new Error('Template base render functions need to be extended');
  }

  async renderEmail({ user, data }) {
    throw new Error('Template base render functions need to be extended');
  }

  async render({ delivery, user, data }) {

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
