const queries = require('./queries');
const userQueries = require('../user/queries');

module.exports = async function deleteUserGroup(ctx) {
  // TODO: add validation
  const userExternalId = ctx.params.user_id;
  const groupName = ctx.params.group_name.toLowerCase();

  const user = await userQueries.getUserByExternalId(userExternalId);
  if (!user) {
    ctx.response.status = 401;
    ctx.fail({ id: `user with id ${user_id} does not exists` });
    return;
  }

  try {
    await queries.deleteUserGroup(user.id, groupName);
  } catch (error) {
    if (error.code === '23505') {
      ctx.response.status = 409;
      ctx.fail({ group: 'user not in group' });
      return;
    }
    throw error;
  }

  ctx.success({ id: userExternalId, group: groupName });
};
