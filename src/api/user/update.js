const queries = require('./queries');
const util = require('../../lib/util');

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
    await queries.addUserGroups(user.id, util.lowerCaseArr(groups));
  }

  /** Update lowercases tags **/
  if (tags) {
    await queries.deleteUserTags(user.id);
    await queries.addUserTags(user.id, util.lowerCaseArr(tags));
  }

  /** Get user.groups and user.tags **/
  user.groups = (await queries.getUserGroupsById(user.id));
  user.tags = (await queries.getUserTagsById(user.id));

  ctx.success(user);
};
