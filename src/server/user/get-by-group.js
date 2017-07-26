const queries = require('./queries');
const db = require('../../database/client');

module.exports = async function getUsersByGroup(ctx) {
  const group = ctx.params.group.toLowerCase();

  const users = await queries.getUsersByGroup(group);

  ctx.success(users);
};
