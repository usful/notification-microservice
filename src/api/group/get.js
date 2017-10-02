const queries = require('./queries');

module.exports = async function getGroupUsers(ctx) {

  // TODO: add validation
  const groupName = ctx.params.name;

  const res = await queries.getUserIdsByGroupName(groupName);
  const ids = res.map(usr => usr.external_id);

  ctx.success(ids);
};
