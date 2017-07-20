const squel = require('squel').useFlavour('postgres')
const db = require('../../../database/client')

module.exports = async function getUser(ctx) {
  const external_id = ctx.params.id
  const user = await db.oneOrNone(
    'SELECT * FROM account WHERE external_id = $1',
    [external_id]
  )

  if (!user) {
    ctx.response.status = 404
    ctx.fail({ id: `user with id ${external_id} not found` })

    return
  }

  ctx.success(user)
}
