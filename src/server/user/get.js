const squel = require('squel').useFlavour('postgres');
const db = require('../../../database/client');

module.exports = async function getUser(ctx, next) {
  const external_id = ctx.params.id;
  const user = await db.oneOrNone('SELECT * FROM account WHERE external_id = $1', [external_id]);
  console.log('user', user);
  if (!user) {
    ctx.response.status = 404;
    ctx.response.body = { message: 'user not found' };
    next();
    return;
  }

  ctx.response.body = user;
  next();
}
