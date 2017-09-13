const queries = require('./queries');

module.exports = async function getUser(ctx) {
  const external_id = ctx.params.id;
  const user = await queries.getUserByExternalId(external_id);

  if (!user) {
    ctx.response.status = 404;
    ctx.fail({ id: `user with id ${external_id} not found` });

    return;
  }

  user.groups = (await queries.getUserGroupsById(user.id));
  user.tags = (await queries.getUserTagsById(user.id));

  ctx.success(user);
};
