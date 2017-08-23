const logger = require('../logger');
const queries = require('./queries');

module.exports = async function createWebhook(ctx) {
  const { url, transport } = ctx.request.body;

  let webhook;
  try {
    webhook = await queries.createWebhook(url, transport);
  } catch (err) {
    if (err.code === '23505') {
      ctx.response.status = 400;
      ctx.fail({ url: `url ${url} already registered for another webhook` });
      return;
    }
    throw err; // TODO: Create a new Error in all db errors to replace the stack
  }

  logger.info('[CreateWebhook] created', webhook);

  ctx.success(webhook);
};
