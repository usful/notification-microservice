const squel = require('squel').useFlavour('postgres')
const utils = require('../utils')
const db = require('../../../database/client')

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

  const notificationUsersQuery = squel
    .insert()
    .into('notification_users')
    .setFieldsRows(
      users.map(user_id => ({
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

  ctx.success(notification)
}
