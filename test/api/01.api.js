const request = require('supertest');
const expect = require('chai').expect;
const API = require('../../src/API');

let api;
let server;

describe('API', () => {
  it('should intialize server', async () => {
    api = new API();
    await api.start();
    server = api.server;
  });

  it('should return ping success', async () => {
    const res = await request(server).get('/api/ping').expect(200);
    expect(res.body).to.be.an('object');
    expect(res.body.status).to.equal('success');
    expect(res.body.data.time).to.be.a('number');
  });

  it('should stop server', async () => {
    await api.stop();
  });
});
