const squel = require('squel').useFlavour('postgres')
const utils = require('../utils')
const db = require('../../../database/client')

module.exports = async function updateNotification(ctx) {
  const id = ctx.params.id

  const { by, at, template_id, required_by, data } = ctx.request.body

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
    notification = await db.one(baseQuery.toString())
  } catch (err) {
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

  console.log('notification updated', notification)
  ctx.success(notification)
}
