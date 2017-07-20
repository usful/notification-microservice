const squel = require('squel').useFlavour('postgres')
const utils = require('../utils')
const db = require('../../../database/client')

// TODO: Abstract queries in a library
module.exports = async function createNotification(ctx) {
  /**
   * Required fields:
   * by, at, template_id, users
   */

  const { by, at, template_id, required_by, data, users } = ctx.request.body

  const baseQuery = squel
    .insert()
    .into('notification')
    .set('by', utils.pgArr(by))
    .set('at', squel.rstr(`to_timestamp(${at})`))
    .set('template_id', template_id)
    .returning('*')

  if (required_by) {
    baseQuery.set('required_by', email)
  }

  if (data) {
    baseQuery.set('sms', data)
  }

  console.log('Running query', baseQuery.toString())

  let notification
  try {
    notification = await db.one(baseQuery.toString())
  } catch (err) {
    if (err.code === '23503') {
      ctx.response.status = 404
      ctx.fail({
        template_id: `template with id ${template_id} does not exists`,
      })
      return
    }
  }

  console.log('notification created', notification)

  // Get id's of users
  const user_ids_res = await db.many('SELECT id FROM account WHERE external_id IN ($1:csv)', [users])
  const user_ids = user_ids_res.map(user => user.id)

  const notificationUsersQuery = squel
    .insert()
    .into('notification_users')
    .setFieldsRows(
      user_ids.map(user_id => ({
        notification_id: notification.id,
        user_id,
      }))
    )

  console.log('running query', notificationUsersQuery.toString())

  try {
    await db.none(notificationUsersQuery.toString())
  } catch (err) {
    if (err.code === '23503') {
      ctx.response.status = 400
      ctx.fail({
        users: 'one or more ids were not found, notification was created without users',
      })
      return
    }
    throw err
  }

  notification.users = users;
  ctx.success(notification)
}
