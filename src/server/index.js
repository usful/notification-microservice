const app = require('./server');
const config = require('../config');

app.listen(config.port);
console.log(`notifications-microservice ${process.pid} listening on ${config.port}`);
