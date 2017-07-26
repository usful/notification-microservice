const winston = require('winston');
const queries = require('./queries');
const db = require('../../database/client');

module.exports = async function updateNotification(ctx) {
  const id = ctx.params.id;
  const { by, at, template_id, users, required_by, data } = ctx.request.body;

  /** Check users and get their ids **/
  let user_ids;
  if (users) {
    user_ids = (await queries.getUserIdsFromExternalIds(users)).ids;
    if (user_ids.length !== users.length) {
      ctx.response.status = 400;
      ctx.fail({ users: 'one or more user ids were not found' });
      return;
    }
  }

  /** Update notification **/
  let notification;
  try {
    notification = await queries.updateNotification({
      id,
      by,
      at,
      template_id,
      required_by,
      data,
    });
  } catch (err) {
    // TODO: how to differenciate between by and required_by errors
    if (err.code === '22P02') {
      ctx.response.status = 400;
      ctx.fail({
        by: 'by or required_by has an invalid value',
        required_by: 'by or required_by has an invalid value',
      });
      return;
    }
    throw err;
  }

  if (!notification) {
    ctx.response.status = 404;
    ctx.fail({ id: `notification with id ${id} not found` });

    return;
  }

  /** Update users **/
  if (users) {
    await queries.deteleNotificationUsers(id);

    try {
      await queries.insertNotificationUsers(notification.id, user_ids);
    } catch (err) {
      if (err.code === '23503') {
        ctx.response.status = 400;
        ctx.fail({
          users: 'one or more ids were not found, notification was updated without users',
        });
        return;
      }
      throw err;
    }
  }

  notification.users = users;
  winston.info('[UpdateNotification] updated', notification);
  ctx.success(notification);
};
