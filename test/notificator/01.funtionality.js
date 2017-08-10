const request = require('supertest');
const expect = require('chai').expect;
const apiConfig = require('../api-config');
const resetDB = require('../scripts/methods/reset-db');
const createTestData = require('../scripts/methods/create-test-data');
const API = require('../../src/api');
const Notificator = require('../../src/notificator');

let api;
let server;
let notificator;

// TODO: Fix dbClient warning
describe('Notificator', () => {
  before(resetDB);
  before(async () => {
    api = new API(apiConfig);
    await api.start();
    server = api.server;
  });
  after(async () => {
    await api.stop();
    notificator.kill();
  });

  it('should intialize notificator', async () => {
    notificator = new Notificator();
    notificator.init();
    notificator.run().then(() => console.log('notificator stoped'));
  });

  it('should send 1000 notifications', async function() {
    this.timeout(10000);

    let sentCount = 0;
    notificator.on('done', () => sentCount++);
    await createTestData(api, server, 10, 10, 1000);
    await new Promise(resolve => {
      let intervalId;
      intervalId = setInterval(() => {
        if (sentCount >= 1000) {
          clearInterval(intervalId);
          resolve();
        }
      }, 500);
    });
  });
});
