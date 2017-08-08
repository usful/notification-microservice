const queries = require('./queries');
const utils = require('../../utils');

module.exports = async function updateUser(ctx) {
  const external_id = ctx.params.id;
  const { name, email, sms, voice, delivery, language, timezone, active, groups, tags } = ctx.request.body;

  /** Update user **/
  const user = await queries.updateUser({ external_id, name, email, sms, voice, delivery, language, active });
  if (!user) {
    ctx.response.status = 404;
    ctx.fail({ id: `user with id ${external_id} not found` });

    return;
  }

  /** Update lowercased groups **/
  if (groups) {
    await queries.deleteUserGroups(user.id);
    await queries.addUserGroups(user.id, utils.lowerCaseArr(groups));
  }

  /** Update lowercases tags **/
  if (tags) {
    await queries.deleteUserTags(user.id);
    await queries.addUserTags(user.id, utils.lowerCaseArr(tags));
  }

  /** Get user.groups and user.tags **/
  user.groups = (await queries.getUserGroupsById(user.id)).groups;
  user.tags = (await queries.getUserTagsById(user.id)).tags;

  ctx.success(user);
};
