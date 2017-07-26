const app = require('./server');
const config = require('../../config.json')['env:global'];

app.listen(config.port);
console.log(`notifications-microservice ${process.pid} listening on ${config.port}`);
