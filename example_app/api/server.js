const { API } = require('../../src');

const config = {
  port: 8080,
  dbConnection: {
    host: "localhost",
    port: 5432,
    database: "notifications",
    user: "notificator",
    max: 10,
    idleTimeoutMillis: 30000,
  },
};

const api = new API(config);

api.start(() => console.log(`notifications-microservice ${process.pid} listening on ${config.port}`));

// api.stop(() => console.log('api stopped'));
