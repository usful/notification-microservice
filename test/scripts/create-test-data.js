const createTestData = require('./methods/create-test-data');
const { API } = require('../../src');

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

const USERS_QTY = 10;


(async () => {

  const api = new API(apiConfig);
  await api.start();
  const server = api.server;

  await createTestData({ api, server, usersQTY: USERS_QTY });
})
  .then(() => console.log('[createTestData] finished'))
  .catch(error => console.error('[Error createTestData]', error));
