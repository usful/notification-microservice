const queries = require('./queries');

module.exports = async function getUsersTags(ctx) {

  // TODO: add validation
  const tagName = ctx.params.name.toLowerCase();

  const res = await queries.getUserIdsByTagName(tagName);
  const ids = res.map(usr => usr.external_id);

  ctx.success(ids);
};
