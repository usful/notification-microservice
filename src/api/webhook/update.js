const queries = require('./queries');
const logger = require('../logger');

module.exports = async function updateWebhook(ctx) {
  const { url, type, transport } = ctx.request.body;

  let webhook;
  try {
    webhook = await queries.updateWebhook({url, type, transport});
  }catch(error){
    ctx.fail(`Couldn't update the webhook`, ctx.request.body);
    throw error;
  }

  logger.info('[updateWebhook] updated', webhook);

  ctx.success(webhook);
};