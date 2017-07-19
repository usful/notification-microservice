const Koa = require('koa');
const convert = require('koa-convert');
const Router = require('koa-better-router');
const bodyParser = require('koa-better-body');
const router = Router({ prefix: '/api' }).loadMethods();
const createUser = require('./user/create-user');

const config = require('../../config.json')['env:global'];
const app = new Koa();

/**
 * Routes
 * -------
 * User
 * post /api/user/create
 * get /api/user/:id
 * update /api/user/:id
 * delete /api/user/:id
 *
 * Users
 * /api/users/:group  - get users that belong to a group
 *
 * Notification
 * post /api/notification/create
 * get /api/notification/:id
 * update /api/notification/:id
 * delete /api/notification/:id
 *
 * Notifications
 * get /api/notifications/sent  - get sent notifications
 * get /api/notifications/unsent - get unsent notifications
 *
 * Template
 * post /api/template/create
 * get /api/template/:id
 * update /api/template/:id
 * delete /api/template/:id
 *
 *
 */
router.get('user/:id', async (ctx, next) => {
  ctx.body = `User ${ctx.params.id}`;

  return next();
});

router.post('user/create', createUser);

// Parse body and save it in ctx.request.body
app.use(convert(bodyParser({ fields: 'body' })));

// Catch postgres errors and format them
app.use(async function onPgError(ctx, next) {
  try {
    await next();
  } catch (e) {

    // TODO: Define the format of the errors
    if (e.code === '23505') {
      ctx.response.status = 400;
      ctx.response.body = {
        type: 'constraint',
        constraint: e.constraint,
      };
      return;
    }

    throw e;
  }
});

app.use(router.middleware());
app.listen(config.port);
console.log(`notifications-microservice ${process.pid} listening on ${config.port}`);
