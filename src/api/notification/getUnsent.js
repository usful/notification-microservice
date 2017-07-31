const queries = require('./queries');

module.exports = async function getSent(ctx, next) {
  const notifications = await queries.getNotificationsUnsent();

  ctx.success(notifications);
};
