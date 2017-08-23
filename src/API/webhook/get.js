const queries = require('./queries');

module.exports = async function getWebhook(ctx) {;
  const webhooks = await queries.getWebhooks();

  ctx.success(webhooks);
};
