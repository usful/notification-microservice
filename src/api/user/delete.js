const queries = require('./queries');

module.exports = async function deleteUser(ctx) {
  const external_id = ctx.params.id;

  const user = await queries.getUserByExternalId(external_id);
  if (!user) {
    ctx.response.status = 404;
    ctx.fail({ id: `user with id ${external_id} not found` });
    return;
  }

  /** TODO: There is the possibility that the user does not exists anymore on this line, its just too unlikely **/

  await queries.deleteUserNotifications(user.id);

  await queries.deleteUserGroups(user.id);

  await queries.deleteUserByExternalId(user.external_id);

  ctx.success({ external_id: user.external_id });
};
