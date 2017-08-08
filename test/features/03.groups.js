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
    // Creates 10 users using the API
    await createTestData(api, server, 10);
  });

  after(async () => {
    await api.stop();
  });

  it('should get ids of users in a group success', async () => {
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

  it('should add user to group successfully', async () => {
    const postRes = await request(server)
      .post('/api/group/test-user-0/new-group-01')
      .send()
      .set('Accept', 'application/json')
      .expect(200);

    expect(postRes.body.data).to.deep.equal({ id: 'test-user-0', group: 'new-group-01' });

    const getRes = await request(server)
      .get('/api/group/new-group-01')
      .send()
      .set('Accept', 'application/json')
      .expect(200);

    expect(getRes.body.data).to.deep.equal(['test-user-0']);
  });

  it('should remove user from group successfully', async () => {
    const deleteRes = await request(server)
      .delete('/api/group/test-user-0/new-group-01')
      .send()
      .set('Accept', 'application/json')
      .expect(200);

    expect(deleteRes.body.data).to.deep.equal({ id: 'test-user-0', group: 'new-group-01' });

    const getRes = await request(server)
      .get('/api/group/new-group-01')
      .send()
      .set('Accept', 'application/json')
      .expect(200);

    expect(getRes.body.data).to.deep.equal([]);
  });
});
