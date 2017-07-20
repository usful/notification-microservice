const squel = require('squel').useFlavour('postgres')
const utils = require('../utils')
const db = require('../../../database/client')

module.exports = async function createTemplate(ctx) {

  // TODO: Ensure there is at least one string template?

  const {
    name,
    email,
    sms,
    voice,
    web,
    push,
  } = ctx.request.body

  const baseQuery = squel
    .insert()
    .into('template')
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

  if (web) {
    baseQuery.set('delivery', web)
  }

  if (push) {
    baseQuery.set('timezone', push)
  }

  let template = await db.one(baseQuery.toString())

  console.log('template created', template)
  ctx.success(template)
}
