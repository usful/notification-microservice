const squel = require('squel').useFlavour('postgres')
const db = require('../../../database/client')

module.exports = async function getNotification(ctx) {
  const id = ctx.params.id
  const notification = await db.oneOrNone(
    'SELECT * FROM notification WHERE id = $1',
    [id]
  )

  if (!notification) {
    ctx.response.status = 404
    ctx.fail({ id: `notification with id ${id} not found` })

    return
  }

  ctx.success(notification)
}
