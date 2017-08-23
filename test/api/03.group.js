const request = require('supertest');
const expect = require('chai').expect;
const resetDB = require('../scripts/methods/reset-db');
const createTestData = require('../scripts/methods/create-test-data');
const API = require('../../src/API');

let api;
let server;

describe('Group', () => {
  before(resetDB);

  before(async () => {
    api = new API();
    await api.start();
    server = api.server;
  });

  before(async () => {
    // Creates 10 users using the API
    await createTestData(api, server, 10, 0, 0);
  });

  after(async () => {
    await api.stop();
  });

  it('should get ids of users in a group success', async () => {
    const res = await request(server)
      .get('/api/group/group-a')
      .send()
      .set('Accept', 'application/json')
      .expect(200);

    expect(res.body.data).to.deep.equal([
      'user-0',
      'user-1',
      'user-2',
      'user-3',
      'user-4',
      'user-5',
      'user-6',
      'user-7',
      'user-8',
      'user-9',
    ]);
  });

  it('should add user to group successfully', async () => {
    const postRes = await request(server)
      .post('/api/group/user-0/new-group-01')
      .send()
      .set('Accept', 'application/json')
      .expect(200);

    expect(postRes.body.data).to.deep.equal({ id: 'user-0', group: 'new-group-01' });

    const getRes = await request(server)
      .get('/api/group/new-group-01')
      .send()
      .set('Accept', 'application/json')
      .expect(200);

    expect(getRes.body.data).to.deep.equal(['user-0']);
  });

  it('should remove user from group successfully', async () => {
    const deleteRes = await request(server)
      .delete('/api/group/user-0/new-group-01')
      .send()
      .set('Accept', 'application/json')
      .expect(200);

    expect(deleteRes.body.data).to.deep.equal({ id: 'user-0', group: 'new-group-01' });

    const getRes = await request(server)
      .get('/api/group/new-group-01')
      .send()
      .set('Accept', 'application/json')
      .expect(200);

    expect(getRes.body.data).to.deep.equal([]);
  });
});
