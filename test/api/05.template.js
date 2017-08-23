const request = require('supertest');
const expect = require('chai').expect;
const resetDB = require('../scripts/methods/reset-db');
const createTestData = require('../scripts/methods/create-test-data');
const API = require('../../src/API');

let api;
let server;

describe('Template', () => {
  before(resetDB);
  before(async () => {
    api = new API();
    await api.start();
    server = api.server;
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
