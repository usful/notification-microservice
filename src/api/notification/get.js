const squel = require('squel').useFlavour('postgres');
const queries = require('./queries');

module.exports = async function getNotification(ctx) {
  const id = ctx.params.id;

  const notification = await queries.getNotificationById(id);

  if (!notification) {
    ctx.response.status = 404;
    ctx.fail({ id: `notification with id ${id} not found` });

    return;
  }

  ctx.success(notification);
};
