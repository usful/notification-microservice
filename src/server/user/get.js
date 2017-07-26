const queries = require('./queries');
const db = require('../../database/client');

module.exports = async function getUser(ctx) {
  const external_id = ctx.params.id;
  const user = await queries.getUserByExternalId(external_id);

  if (!user) {
    ctx.response.status = 404;
    ctx.fail({ id: `user with id ${external_id} not found` });

    return;
  }

  ctx.success(user);
};
