const request = require('supertest');
const expect = require('chai').expect;
const app = require('../src/server');

let server;

describe('Server', () => {
  describe('Start', function() {
    it('should intialize server', async () => {
      server = app.listen();
    });
  });

  describe('Ping', () => {
    it('should return ping success', async () => {
      const res = await request(server).get('/api/ping').expect(200);
      expect(res.body).to.be.an('object');
      expect(res.body.data.time).to.be.a('number');
    });
  });

  describe('User', () => {
    it('should create an user successfully', async() => {
      const res = await request(server)
        .post('/api/user')
        .send({
          external_id: 'test-user-001',
          name: 'test-user-001',
          email: 'info+test-user-001@joinlane.com',
          delivery: ['email'],
          groups: ['test-group-1', 'test-group-2'],
        })
        .set('Accept', 'application/json')
        .expect(200);

        expect(res.body.data.external_id).to.equal('test-user-001');
    });

    it('should not create user with same id', async() => {
      const res = await request(server)
        .post('/api/user')
        .send({
          external_id: 'test-user-001',
          name: 'test-user-001',
          email: 'info+test-user-001@joinlane.com',
          delivery: ['email'],
          groups: ['test-group-1', 'test-group-2'],
        })
        .set('Accept', 'application/json')
        .expect(400);

        expect(res.body.data.external_id).to.be.a('string');
    });

    it('should validate required fields', async() => {
      const res = await request(server)
        .post('/api/user')
        .send({})
        .set('Accept', 'application/json')
        .expect(400);

        expect(res.body.data.external_id).to.be.a('string');
        expect(res.body.data.name).to.be.a('string');
    });

  });
});
