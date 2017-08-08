const queries = require('./queries');
const logger = require('../logger');
const util = require('../../lib/util');

module.exports = async function createUser(ctx) {
  const { external_id, name, email, sms, voice, delivery, language, timezone, active, groups, tags } = ctx.request.body;

  /** Create user **/
  let user;
  try {
    user = await queries.createUser({ external_id, name, email, sms, voice, delivery, timezone, language, active });
  } catch (err) {
    if (err.code === '23505') {
      ctx.response.status = 400;
      ctx.fail({ external_id: `external_id ${external_id} already registered for another user` });
      return;
    }

    throw err;
  }

  /** Add lowercased groups to user **/
  if (groups) {
    await queries.addUserGroups(user.id, util.lowerCaseArr(groups));
  }

  /** Add lowercased tags to user **/
  if (tags) {
    await queries.addUserTags(user.id, util.lowerCaseArr(tags));
  }

  /** Get user, user.groups and user.tags **/
  const createdUser = await queries.getUserByExternalId(external_id);
  createdUser.groups = (await queries.getUserGroupsById(createdUser.id)).groups;
  createdUser.tags = (await queries.getUserTagsById(createdUser.id)).tags;

  logger.debug('[createUser] user created', createdUser);
  ctx.success(createdUser);
};
