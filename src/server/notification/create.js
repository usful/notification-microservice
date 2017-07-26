const winston = require('winston');
const squel = require('squel').useFlavour('postgres');
const db = require('../../database/client');
const queries = require('./queries');

/**
 * Required fields:
 * by, at, template_id, users
 */
module.exports = async function createNotification(ctx) {
  const { by, at, template_id, users, required_by, data } = ctx.request.body;

  /** Check users and get their ids **/
  const { ids: user_ids } = await queries.getUserIdsFromExternalIds(users);
  if (user_ids.length !== users.length) {
    ctx.response.status = 400;
    ctx.fail({ users: 'one or more user ids were not found' });
    return;
  }

  /** Create notification **/
  let notification;
  try {
    notification = await queries.createNotification(
      by,
      at,
      template_id,
      required_by,
      data
    );
  } catch (err) {
    if (err.code === '23503') {
      ctx.response.status = 404;
      ctx.fail({
        template_id: `template with id ${template_id} does not exists`
      });
      return;
    }
    throw err;
  }

  /** Add users to notification **/
  try {
    await queries.insertNotificationUsers(notification.id, user_ids);
  } catch (err) {
    if (err.code === '23503') {
      ctx.response.status = 400;
      ctx.fail({
        users:
          'one or more ids were not found, notification was created without users'
      });
      return;
    }
    throw err;
  }

  notification.users = users;

  winston.info('[CreateNotification] created', notification);

  ctx.success(notification);
};
