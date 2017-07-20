const squel = require('squel').useFlavour('postgres')
const utils = require('../utils')
const db = require('../../../database/client')

module.exports = async function createUser(ctx) {
  // TODO: Add schema to validate data
  // TODO: Default language is defined on schema?

  const {
    external_id,
    name,
    email,
    sms,
    voice,
    delivery,
    language,
    timezone,
    active,
  } = ctx.request.body

  const baseQuery = squel
    .insert()
    .into('account')
    .set('external_id', external_id)
    .set('name', name)
    .returning('*')

  if (email) {
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
