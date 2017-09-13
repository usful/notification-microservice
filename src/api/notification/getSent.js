const squel = require('squel').useFlavour('postgres');
const queries = require('./queries');
//TODO modify this to also take body params that filter
module.exports = async function getSent(ctx, next) {
  const {
    userId,
    limit,
  } = ctx.request.body;
  const notifications = await queries.getNotificationsSent();

  ctx.success(notifications);
};
