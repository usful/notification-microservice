const squel = require('squel').useFlavour('postgres')
const utils = require('../utils')
const db = require('../../../database/client')

// TODO: Abstract queries in a library
module.exports = async function updateNotification(ctx) {
  const id = ctx.params.id

  const { by, at, template_id, required_by, data, users } = ctx.request.body

  const baseQuery = squel
    .update()
    .table('notification')
    .where('id = ?', id)
    .returning('*')

  if (by) {
    baseQuery.set('by', utils.pgArr(by))
  }

  if (at) {
    baseQuery.set('at', squel.rstr(`to_timestamp(${at})`))
  }

  if (template_id) {
    baseQuery.set('template_id', template_id)
  }

  if (required_by) {
    baseQuery.set('required_by', email)
  }

  if (data) {
    baseQuery.set('sms', data)
  }

  console.log('Running query', baseQuery.toString())

  let notification
  try {
    notification = await db.oneOrNone(baseQuery.toString())
  } catch (err) {
    console.log('[Error updating notification]', err)
    // TODO: how to differenciate between by and required_by errors
    if (err.code === '22P02') {
      ctx.response.status = 400
      ctx.fail({
        by: 'by or required_by has an invalid value',
        required_by: 'by or required_by has an invalid value',
      })
      return
    }
    throw err
  }

  if (!notification) {
    ctx.response.status = 404
    ctx.fail({ id: `notification with id ${id} not found` })

    return
  }

  if (users) {
    console.log('deleting users from notification')
    await db.none('DELETE FROM notification_users where notification_id = $1', [
      id,
    ])

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

      console.log('adding users to notification')
      console.log('running query', notificationUsersQuery.toString())

      try {
        await db.none(notificationUsersQuery.toString())
      } catch (err) {
        if (err.code === '23503') {
          ctx.response.status = 400
          ctx.fail({
            users: 'one or more ids were not found, notification was updated without users',
          })
          return
        }
        console.log('[Error] updating users', err)
        throw err
      }
  }

  notification.users = users;
  console.log('notification updated', notification)
  ctx.success(notification)
}
