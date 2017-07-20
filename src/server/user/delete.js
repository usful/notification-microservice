const db = require('../../../database/client')

module.exports = async function deleteUser(ctx) {
  const external_id = ctx.params.id

  const user = await db.oneOrNone(
    'DELETE FROM account where external_id = $1 returning id',
    [external_id]
  )

  if (!user) {
    ctx.response.status = 404
    ctx.fail({ id: `user with id ${external_id} not found` });
    return
  }

  ctx.success(user)
}
