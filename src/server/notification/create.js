const squel = require('squel').useFlavour('postgres')
const utils = require('../utils')
const db = require('../../../database/client')

module.exports = async function createNotification(ctx) {

  const {
    by,
    required_by,
    at,
    template_id,
    data,
  } = ctx.request.body

  const baseQuery = squel
    .insert()
    .into('notification')
    .set('by', utils.pgArr(by))
    .set('at', at)
    .returning('*')

  if (required_by) {
    baseQuery.set('email', email)
  }

  if (sms) {
    baseQuery.set('sms', sms)
  }

  if (voice) {
    baseQuery.set('voice', voice)
  }

  if (delivery) {
    baseQuery.set('delivery', utils.pgArr(delivery))
  }

  if (timezone) {
    baseQuery.set('timezone', timezone)
  }

  if (language) {
    baseQuery.set('language', language)
  } else {
    baseQuery.set('language', 'en')
  }

  if (active || active == false) {
    baseQuery.set('timezone', active)
  }

  console.log('Running query', baseQuery.toString())

  let user
  try {
    user = await db.one(baseQuery.toString())
  } catch (err) {
    // TODO: We are assuming that external_id has the only unique constraint
    if (err.code === '23505') {
      ctx.response.status = 400
      ctx.fail({ id: 'this is is already registered for another user' })
      return
    }
  }

  console.log('user registered', user)
  ctx.success(user)
}
