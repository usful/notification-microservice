const Koa = require('koa');
const convert = require('koa-convert');
const Router = require('koa-better-router');
const bodyParser = require('koa-better-body');
const router = Router({ prefix: '/api' }).loadMethods();
const winston = require('winston');
const userAPI = require('./user');
const notificationAPI = require('./notification');
const templateAPI = require('./template');
const koaJsend = require('./middleware/jsend');

const app = new Koa();

winston.info('Starting Notification Microservice...');

if (process.env.LOG_LEVEL) {
  console.log('setting log level to', process.env.LOG_LEVEL);
  winston.default.transports.console.level = process.env.LOG_LEVEL;
}

router.post('user', userAPI.createSchema, userAPI.create);
router.get('user/:id', userAPI.get);
router.put('user/:id', userAPI.updateSchema, userAPI.update);
router.delete('user/:id', userAPI.delete);

router.get('users/:group', userAPI.getByGroup);

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
    winston.error('[Internal Server Error]', e);
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
    winston.info('[Validation Error]', error.details);

    const formatedMessage = error.details.reduce((acc, item) => { acc[item.path] = item.message; return acc; }, {});

    ctx.response.status = 400;
    ctx.fail(formatedMessage);
  }
});

app.use(router.middleware());
module.exports = app;
