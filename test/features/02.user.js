const request = require('supertest');
const expect = require('chai').expect;
const apiConfig = require('../api-config');
const resetDB = require('../scripts/methods/reset-db');
const API = require('../../src/api');

let api;
let server;

describe('User', () => {
  before(resetDB);
  before(async () => {
    api = new API(apiConfig);
    await api.start();
    server = api.server;
  });
  after(async () => {
    await api.stop();
  });

  it('should create an user successfully', async () => {
    const res = await request(server)
      .post('/api/user')
      .send({
        external_id: 'test-user-001',
        name: 'test-user-001',
        email: 'info+test-user-001@joinlane.com',
        sms: '+1 416-000-0000',
        voice: '+1 416-000-0000',
        delivery: ['email'],
        language: 'en',
        timezone: 'America/Toronto',
        active: true,
        groups: ['group-1', 'group-2', 'group-3'],
        tags: ['tag-1', 'tag-2', 'tag-3'],
      })
      .set('Accept', 'application/json')
      .expect(200);

    expect(res.body.data).to.deep.include({
      // id: 1,
      external_id: 'test-user-001',
      // created: '2017-08-01T20:55:07.969Z',
      // updated: '2017-08-01T20:55:07.969Z',
      name: 'test-user-001',
      email: 'info+test-user-001@joinlane.com',
      email_status: 'unverified',
      sms: '+1 416-000-0000',
      sms_status: 'unverified',
      voice: '+1 416-000-0000',
      voice_status: 'unverified',
      delivery: ['email'],
      language: 'en',
      timezone: 'America/Toronto',
      active: true,
      groups: ['group-1', 'group-2', 'group-3'],
      tags: ['tag-1', 'tag-2', 'tag-3'],
    });
  });

  it('should update an user successfully', async () => {
    const res = await request(server)
      .put('/api/user/test-user-001')
      .send({
        name: 'test-user-001-u',
        email: 'info+test-user-001-u@joinlane.com',
        sms: '+1 416-000-0001',
        voice: '+1 416-000-0001',
        delivery: ['email', 'sms'],
        language: 'en',
        timezone: 'America/Toronto',
        active: true,
        groups: ['group-1-u', 'group-2-u', 'group-3-u'],
        tags: ['tag-1-u', 'tag-2-u', 'tag-3-u'],
      })
      .set('Accept', 'application/json')
      .expect(200);

    expect(res.body.data).to.deep.include({
      external_id: 'test-user-001',
      name: 'test-user-001-u',
      email: 'info+test-user-001-u@joinlane.com',
      email_status: 'unverified',
      sms: '+1 416-000-0001',
      sms_status: 'unverified',
      voice: '+1 416-000-0001',
      voice_status: 'unverified',
      delivery: ['email', 'sms'],
      language: 'en',
      timezone: 'America/Toronto',
      active: true,
      groups: ['group-1-u', 'group-2-u', 'group-3-u'],
      tags: ['tag-1-u', 'tag-2-u', 'tag-3-u'],
    });
  });

  it('should get an user successfully', async () => {
    const res = await request(server)
      .get('/api/user/test-user-001')
      .send()
      .set('Accept', 'application/json')
      .expect(200);

    expect(res.body.data).to.deep.include({
      external_id: 'test-user-001',
      name: 'test-user-001-u',
      email: 'info+test-user-001-u@joinlane.com',
      email_status: 'unverified',
      sms: '+1 416-000-0001',
      sms_status: 'unverified',
      voice: '+1 416-000-0001',
      voice_status: 'unverified',
      delivery: ['email', 'sms'],
      language: 'en',
      timezone: 'America/Toronto',
      active: true,
      groups: ['group-1-u', 'group-2-u', 'group-3-u'],
      tags: ['tag-1-u', 'tag-2-u', 'tag-3-u'],
    });
  });

  it('should delete an user successfully', async () => {
    const deleteRes = await request(server)
      .delete('/api/user/test-user-001')
      .send()
      .set('Accept', 'application/json')
      .expect(200);

    const getRes = await request(server)
      .get('/api/user/test-user-001')
      .send()
      .set('Accept', 'application/json')
      .expect(404);

    expect(getRes.body.data).to.be.an('object');
    expect(getRes.body.data.id).to.equals('user with id test-user-001 not found');
  });

  // it('should not create user with same id', async () => {
  //   const res = await request(server)
  //     .post('/api/user')
  //     .send({
  //       external_id: 'test-user-001',
  //       name: 'test-user-001',
  //       email: 'info+test-user-001@joinlane.com',
  //       delivery: ['email'],
  //       groups: ['test-group-1', 'test-group-2'],
  //     })
  //     .set('Accept', 'application/json')
  //     .expect(400);
  //
  //   expect(res.body.data.external_id).to.be.a('string');
  // });
  //
  // it('should validate required fields', async () => {
  //   const res = await request(server).post('/api/user').send({}).set('Accept', 'application/json').expect(400);
  //
  //   expect(res.body.data.external_id).to.be.a('string');
  //   expect(res.body.data.name).to.be.a('string');
  // });
});
