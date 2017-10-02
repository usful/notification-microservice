const queries = require('./queries');

module.exports = async function addUserTag(ctx) {
  const userExternalId = ctx.params.user_id;
  const tagName = ctx.params.tag_name;

  const user = await queries.getUserByExternalId(userExternalId);
  if (!user) {
    ctx.response.status = 401;
    ctx.fail({ id: `user with id ${user_id} does not exists` });
    return;
  }

  try {
    await queries.addUserTag(user.id, tagName);
  } catch (error) {
    if (error.code === '23505') {
      ctx.response.status = 409;
      ctx.fail({ tag: 'user already in tag' });
      return;
    }
    throw error;
  }

  ctx.success({ id: userExternalId, tag: tagName });
};
