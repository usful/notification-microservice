const Koa = require('koa');
const convert = require('koa-convert');
const Router = require('koa-better-router');
const bodyParser = require('koa-better-body');
const router = Router({ prefix: '/api' }).loadMethods();
const logger = require('./logger');
const userAPI = require('./user');
const groupAPI = require('./group');
const tagAPI = require('./tag');
const notificationAPI = require('./notification');
const templateAPI = require('./template');
const webhookAPI = require('./webhook');
const koaJsend = require('./middleware/jsend');

const app = new Koa();

logger.info('Starting Notification Microservice...');

router.post('user', userAPI.createSchema, userAPI.create);
router.get('user/:id', userAPI.get);
router.put('user/:id', userAPI.updateSchema, userAPI.update);
router.delete('user/:id', userAPI.delete);
router.put('user/:id/group/:group_name', userAPI.addToGroup);
router.delete('user/:id/group/:group_name', userAPI.removeFromGroup);
router.put('user/:id/tag/:tag_name', userAPI.addTag);
router.delete('user/:id/tag/:tag_name', userAPI.removeTag);

router.get('group/:name', groupAPI.get);
router.delete('group/:group_name', groupAPI.delete);

router.get('tag/:name', tagAPI.get);
router.delete('tag/:tag_name', tagAPI.delete);

router.get('notification/sent', notificationAPI.getSent);
router.get('notification/unsent', notificationAPI.getUnsent);

router.post('notification', notificationAPI.createSchema, notificationAPI.create);
router.get('notification/:id', notificationAPI.get);
router.put('notification/:id', notificationAPI.updateSchema, notificationAPI.update);
router.delete('notification/:id', notificationAPI.delete);

router.post('template', templateAPI.create);
router.get('template/:id', templateAPI.get);
router.put('template/:id', templateAPI.update);
router.delete('template/:id', templateAPI.delete);

router.post('webhook', webhookAPI.createSchema, webhookAPI.create);
router.get('webhook', webhookAPI.get);
router.get('webhook/:url', webhookAPI.getOne)
router.put('webhook/:url', webhookAPI.update);
router.delete('webhook/:url', webhookAPI.delete);

router.get('ping', async ctx => ctx.success({ time: Math.floor(Date.now() / 1000) }));

/** Parse body and inject body it in ctx.request.body **/
app.use(convert(bodyParser({ fields: 'body' })));

/** Inject jsend formatter to ctx **/
app.use(koaJsend());

/** Catch and format Internal Server Errors **/
app.use(async function onServerError(ctx, next) {
  try {
    await next();
  } catch (e) {
    logger.error('[Internal Server Error]', e);
    ctx.response.status = 500;
    ctx.error('Internal Server Error');
  }
});

/** Catch and format validation errors **/
app.use(async function onValidationError(ctx, next) {
  try {
    await next();
  } catch (error) {
    if (!error.isJoi) {
      throw error;
    }
    logger.info('[Validation Error]', error.details);

    const formatedMessage = error.details.reduce((acc, item) => {
      acc[item.path] = item.message;
      return acc;
    }, {});

    ctx.response.status = 400;
    ctx.fail(formatedMessage);
  }
});

app.use(router.middleware());

/** Async version of app.listen **/
app.asyncListen = port => {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, error => {
      if (error) {
        reject(error);
        return;
      }
      resolve(server);
    });
  });
};

module.exports = app;
