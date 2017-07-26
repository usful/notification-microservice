const winston = require('winston');
const squel = require('squel').useFlavour('postgres');
const utils = require('../utils');
const db = require('../../database/client');

module.exports = async function createTemplate(ctx) {
  const { name, email, sms, voice, web, push } = ctx.request.body;

  const baseQuery = squel.insert().into('template').set('name', name).returning('*');

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

  const template = await db.one(baseQuery.toString());

  winston.info('[CreateTemplate] created', template);
  ctx.success(template);
};
