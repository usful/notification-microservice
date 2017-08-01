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
  // logLevel: ''
};

const api = new API(config);

await api.start();

// api.stop();
