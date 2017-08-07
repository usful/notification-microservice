const request = require('supertest');
const expect = require('chai').expect;
const apiConfig = require('../api-config');
const resetDB = require('../scripts/methods/reset-db');
const createTestData = require('../scripts/methods/create-test-data');
const API = require('../../src/api');

let api;
let server;

describe('Notification', () => {
  before(resetDB);
  before(async () => {
    api = new API(apiConfig);
    await api.start();
    server = api.server;
  });
  before(async () => {
    // Creates 10 users and 10 templates using the API
    await createTestData(api, server, 10, 10, 0);
  });
  after(async () => {
    await api.stop();
  });

  it('should create a notification successfully', async () => {
    const res = await request(server)
      .post('/api/notification')
      .send({
        by: ['email'],
        at: Math.floor(Date.now() / 1000),
        template_id: 1,
        required_by: ['email'],
        data: {
          name: `test-template-1`,
        },
        users: ['test-user-1'],
      })
      .set('Accept', 'application/json')
      .expect(200);
  });
});
