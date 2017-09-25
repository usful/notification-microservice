const queries = require('./queries');

module.exports = async function deleteGroup(ctx) {
  const {groupName} = ctx.body;

  const group = await queries.deleteGroup(groupName);

  if (group === []) {
    ctx.response.status = 404;
    ctx.fail({group: `group with groupName ${groupName} not found`});
    return;
  }

  ctx.success({group: groupName});

};