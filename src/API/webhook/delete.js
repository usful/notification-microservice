const queries = require('./queries');

module.exports = async function deleteWebhook(ctx) {
  const url = ctx.params.url;

  const webhook = await queries.deleteWebhook(url);

  if (!webhook) {
    ctx.response.status = 404;
    ctx.fail({ url: `webhook with url ${url} not found` });
    return;
  }

  ctx.success(webhook);
};
