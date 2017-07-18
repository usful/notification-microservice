const Koa = require('koa');
const Router = require('koa-better-router');
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

app.use(router.middleware());
app.listen(config.port);
console.log(`notifications-microservice ${process.pid} listening on ${config.port}`);
