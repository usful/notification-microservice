const squel = require('squel').useFlavour('postgres');
const queries = require('./queries');
module.exports = async function getSent(ctx) {
  const {
    userId,
    limit,
  } = ctx.request.body;
  const notifications = await queries.getNotificationsSent({userId, limit});

  ctx.success(notifications);
};
