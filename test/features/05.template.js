const request = require('supertest');
const expect = require('chai').expect;
const apiConfig = require('../api-config');
const resetDB = require('../scripts/methods/reset-db');
const createTestData = require('../scripts/methods/create-test-data');
const { API } = require('../../src');

let api;
let server;

describe('User', () => {
  before(resetDB);
  before(async () => {
    api = new API(apiConfig);
    await api.start();
    server = api.server;
  });
  before(async () => {
    // Creates 10 users using the API
    await createTestData(api, server, 10);
  });
  after(async () => {
    await api.stop();
  });

  it('should create an template successfully', async () => {
    const res = await request(server)
      .post('/api/template')
      .send({
        name: 'test-template-001',
        email: {
          todo: 'structure of templated',
        },
      })
      .set('Accept', 'application/json')
      .expect(200);
  });
});
