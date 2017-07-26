const winston = require('winston');
const squel = require('squel').useFlavour('postgres');
const queries = require('./queries');
const utils = require('../utils');
const db = require('../../database/client');

module.exports = async function createUser(ctx) {
  const { external_id, name, email, sms, voice, delivery, language, timezone, active, groups } = ctx.request.body;
  const lowerCasedGroups = utils.lowerCaseArr(groups);

  /** Create user **/
  let user;
  try {
    user = await queries.createUser({ external_id, name, email, sms, voice, delivery, timezone, language, active });
  } catch (err) {
    // TODO: We are assuming that external_id has the only unique constraint
    if (err.code === '23505') {
      ctx.response.status = 400;
      ctx.fail({ external_id: `external_id ${external_id} already registered for another user` });
      return;
    }

    throw err;
  }

  /** Add lowercased groups to user **/
  await queries.addUserGroups(user.id, lowerCasedGroups);

  user.groups = lowerCasedGroups;
  winston.info('[createUser] user created', user);
  ctx.success(user);
};
