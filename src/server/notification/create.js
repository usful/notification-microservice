const squel = require('squel').useFlavour('postgres')
const utils = require('../utils')
const db = require('../../../database/client')

module.exports = async function createNotification(ctx) {

  const {
    by,
    at,
    template_id,
    required_by,
    data,
  } = ctx.request.body

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
      ctx.fail({ template_id: `template with id ${template_id} does not exists` })
      return
    }
  }

  console.log('notification created', notification)
  ctx.success(notification)
}
