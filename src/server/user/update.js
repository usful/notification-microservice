const queries = require('./queries');
const utils = require('../utils');
const db = require('../../database/client');

module.exports = async function updateUser(ctx) {
  const external_id = ctx.params.id;

  const { name, email, sms, voice, delivery, language, timezone, active, groups } = ctx.request.body;
  const lowerCasedGroups = utils.lowerCaseArr(groups);

  /** Update user **/
  const user = await queries.updateUser({ external_id, name, email, sms, voice, delivery, language, active });
  if (!user) {
    ctx.response.status = 404;
    ctx.fail({ id: `user with id ${external_id} not found` });

    return;
  }

  /** Add lowercased groups to user **/
  await queries.deleteUserGroups(user.id);
  await queries.addUserGroups(user.id, lowerCasedGroups);

  ctx.success(user);
};
