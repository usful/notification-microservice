const logger = require('../logger');
const squel = require('squel').useFlavour('postgres');
const dbClient = require('../../database/poolClient');

module.exports = async function updateTemplate(ctx) {
  const id = ctx.params.id;

  const { name, email, sms, voice, web, push } = ctx.request.body;

  const baseQuery = squel.update().table('template').where('id = ?', id).returning('*');

  if (name) {
    baseQuery.set('name', name);
  }

  if (email) {
    baseQuery.set('email', email);
  }

  if (sms) {
    baseQuery.set('sms', sms);
  }

  if (voice) {
    baseQuery.set('voice', voice);
  }

  if (web) {
    baseQuery.set('delivery', web);
  }

  if (push) {
    baseQuery.set('timezone', push);
  }

  const template = await dbClient.db.oneOrNone(baseQuery.toString());

  if (!template) {
    ctx.response.status = 404;
    ctx.fail({ id: `template with id ${id} not found` });

    return;
  }

  logger.debug('[UpdateTemplate] updated', template);
  ctx.success(template);
};
