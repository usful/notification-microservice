const squel = require('squel').useFlavour('postgres');
const dbClient = require('../../database/poolClient');

module.exports = async function getTemplate(ctx) {
  const id = ctx.params.id;
  const template = await dbClient.db.oneOrNone('SELECT * FROM template WHERE id = $1', [id]);

  if (!template) {
    ctx.response.status = 404;
    ctx.fail({ id: `template with id ${id} not found` });

    return;
  }

  ctx.success(template);
};
