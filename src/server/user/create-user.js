const db = require('../../../database/client');

module.exports = async function createUser(ctx, next) {
  console.log('should create user here');

  const res = await db.any('select current_date');

  console.log('db res', res);

  ctx.body='some user response';
  next();
}
