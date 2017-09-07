const Koa = require('koa');
const convert = require('koa-convert');
const bodyParser = require('koa-better-body');
const cp = require('child_process');
const path = require('path');
const Router = require('koa-better-router');
const router = Router().loadMethods();
const http = require('http');

const apiRouteHandler = (ctx) => {
  const body = ctx.body;
  const options = {
    hostname: 'localhost',
    port: 8081,
    path: ctx.path,
    method: ctx.method,
    /**headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }*/
  };
  const req = http.request(options, (res) => {
  });
  req.write(body);
  req.end();
};

// todo heroku app needs api to call the api of the server
router.get('/api/*', apiRouteHandler);
router.post('/api/*', apiRouteHandler);
router.put('/api/*', apiRouteHandler);
router.delete('/api/*', apiRouteHandler);

// todo create web interface that will act as a test app with the notification service.
//router.get('/web/*', );



var port = process.env.PORT || 8080;

const app = new Koa();

app.use(convert(bodyParser({ fields: 'body' })));

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

app.asyncListen(port);

console.log('web app is done loading');
const notificationService = cp.fork(path.resolve(__dirname, '../../src/index.js'));
