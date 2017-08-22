const request = require('supertest');
const expect = require('chai').expect;
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
    api = new API();
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
    notificator.run()
    .then(() => console.log('notificator stoped'))
    .catch((error) => {
      console.error('[Error] notificator hard error', error);
      throw error;
    });
  });

  it('should send 1 notifications', async function() {
    this.timeout(5000);

    let sentCount = 0;
    notificator.on('done', () => sentCount++);
    await createTestData(api, server, 2, 2, 1);
    await new Promise(resolve => {
      let intervalId;
      intervalId = setInterval(() => {
        if (sentCount >= 1) {
          clearInterval(intervalId);
          resolve();
        }
      }, 300);
    });
  });
});
