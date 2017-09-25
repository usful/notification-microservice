const queries = require('./queries');
const userQueries = require('../user/queries');

module.exports = async function deleteUserTag(ctx) {
  const userExternalId = ctx.params.user_id;
  const tagName = ctx.params.tag_name;

  const tags = await queries.deleteTag(tagName);

  if (tags === []) {
    ctx.response.status = 404;
    ctx.fail({tag: `tag with tagName ${tagName} not found`});
    return;
  }

  ctx.success({ id: userExternalId, tag: tagName });
};
