const queries = require('./queries');

module.exports = async function getSent(ctx, next) {
  const {
    userId,
    limit,
  } = ctx.request.body;
  const notifications = await queries.getNotificationsUnsent({userId, limit});

  ctx.success(notifications);
};
