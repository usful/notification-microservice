const request = require('supertest');
const expect = require('chai').expect;
const apiConfig = require('../api-config');
const resetDB = require('../scripts/methods/reset-db');
const createTestData = require('../scripts/methods/create-test-data');
const { API } = require('../../src');

let api;
let server;

describe('Group', () => {
  before(resetDB);

  before(async () => {
    api = new API(apiConfig);
    await api.start();
    server = api.server;
  });

  before(async () => {
    await createTestData(api, server, 10);
  });

  after(async () => {
    await api.stop();
  });

  it('should get ids of users in a group', async () => {
    const res = await request(server)
      .get('/api/group/test-group-a')
      .send()
      .set('Accept', 'application/json')
      .expect(200);

    expect(res.body.data).to.deep.equal([
      'test-user-0',
      'test-user-1',
      'test-user-2',
      'test-user-3',
      'test-user-4',
      'test-user-5',
      'test-user-6',
      'test-user-7',
      'test-user-8',
      'test-user-9',
    ]);
  });
});
