const logger = require('../logger');
const squel = require('squel').useFlavour('postgres');
const dbClient = require('../../database/poolClient');

// TODO: Add schema validation
module.exports = async function createTemplate(ctx) {
  const { name, email, sms, voice, web, push } = ctx.request.body;

  const baseQuery = squel.insert().into('template').set('name', name).returning('*');

  if (email) {
    baseQuery.set('email', JSON.stringify(email));
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

  const template = await dbClient.db.one(baseQuery.toString());

  logger.debug('[CreateTemplate] created', template);
  ctx.success(template);
};
