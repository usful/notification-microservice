const request = require('supertest');
const expect = require('chai').expect;
const resetDB = require('../scripts/methods/reset-db');
const API = require('../../src/API');

let api;
let server;

describe('Webhook', () => {
  before(resetDB);
  before(async () => {
    api = new API();
    await api.start();
    server = api.server;
  });
  after(async () => {
    await api.stop();
  });

  it('should create a _webhook successfully', async () => {
    const res = await request(server)
      .post('/api/_webhook')
      .send({
        url: 'my-test-domain.com/notification-service/_webhook/email',
        transport: 'email',
      })
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('should get all webhooks successfully', async () => {
    const res = await request(server)
      .get('/api/_webhook')
      .send()
      .set('Accept', 'application/json')
      .expect(200);

    expect(res.body.data).to.be.an('array');
    expect(res.body.data[0].url).to.equal('my-test-domain.com/notification-service/_webhook/email');
  });

  it('should delete a _webhook successfully', async () => {
    const delRes = await request(server)
      .delete('/api/_webhook/my-test-domain.com%2Fnotification-service%2Fwebhook%2Femail')
      .send()
      .set('Accept', 'application/json')
      .expect(200);

    const getRes = await request(server)
      .get('/api/_webhook')
      .send()
      .set('Accept', 'application/json')
      .expect(200);

    expect(getRes.body.data).to.be.an('array');
    expect(getRes.body.data.length).to.equal(0);
  });
});
