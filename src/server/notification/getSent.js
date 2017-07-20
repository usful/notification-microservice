const squel = require('squel').useFlavour('postgres')
const db = require('../../../database/client')

module.exports = async function getSent(ctx, next) {
  const notifications = await
    db.any('SELECT * FROM notification WHERE sent IS NOT NULL')

  ctx.success(notifications)
}
