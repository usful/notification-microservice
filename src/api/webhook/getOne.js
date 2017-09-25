const queries = require('./queries');

module.exports = async function getWebhook(ctx) {
  const { url } = ctx.request.body;

  let webhook;
  try {
    webhook = await queries.getWebhooks();
  }catch(error) {
    ctx.fail(`Couldn't find webhook ${ctx.request.body}`);
    throw error;
  }

  ctx.success(webhook);
};