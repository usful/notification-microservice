const squel = require('squel').useFlavour('postgres')
const queries = require('./queries')

module.exports = async function getSent(ctx, next) {
  const notifications = await queries.getNotificationsSent()

  ctx.success(notifications)
}
