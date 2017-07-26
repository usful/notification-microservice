const winston = require('winston');
const squel = require('squel').useFlavour('postgres');
const utils = require('../utils');
const db = require('../../database/client');

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

  const template = await db.oneOrNone(baseQuery.toString());

  if (!template) {
    ctx.response.status = 404;
    ctx.fail({ id: `template with id ${id} not found` });

    return;
  }

  winston.info('[UpdateTemplate] updated', template);
  ctx.success(template);
};
