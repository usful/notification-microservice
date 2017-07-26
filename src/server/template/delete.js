const db = require('../../database/client')

module.exports = async function deleteTemplate(ctx) {
  const id = ctx.params.id

  const template = await db.oneOrNone(
    'DELETE FROM template where id = $1 returning id',
    [id]
  )

  if (!template) {
    ctx.response.status = 404
    ctx.fail({ id: `template with id ${id} not found` });
    return
  }

  ctx.success(template)
}
