const createTestData = require('./methods/create-test-data');
const API = require('../../src/api');

const dbName = process.argv[2];
if (!dbName) {
  throw new Error('Please end database name as first argument');
}

const apiConfig = {
  port: 8080,
  dbConnection: {
    database: dbName,
  },
  logLevel: 'error',
};

let api;
(async () => {

  api = new API(apiConfig);
  await api.start();
  const server = api.server;

  await createTestData(api, server, 10, 10, 1000);
})()
  .then(() => console.log('[createTestData] finished'))
  .catch(error => console.error('[Error createTestData]', error));
