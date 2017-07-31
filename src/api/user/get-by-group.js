const queries = require('./queries');

module.exports = async function getUsersByGroup(ctx) {
  const group = ctx.params.group.toLowerCase();

  const users = await queries.getUsersByGroup(group);

  ctx.success(users);
};
