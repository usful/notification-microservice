const logger = require('../logger');
const queries = require('./queries');

/**
 * Required fields:
 * by, at, template_id, users
 */
module.exports = async function createNotification(ctx) {
  const { by, at, template_id, users, required_by, data } = ctx.request.body;

  /** Create notification **/
  let notification;
  try {
    notification = await queries.createNotification(by, at, template_id, users, required_by, data);
  } catch (err) {
    if (err.code === '23503') {
      ctx.response.status = 404;
      ctx.fail({
        template_id: `template with id ${template_id} does not exists`,
      });
      return;
    }
    throw err;
  }

  logger.info('[CreateNotification] created', notification);

  ctx.success(notification);
};
