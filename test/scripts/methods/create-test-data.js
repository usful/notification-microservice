const request = require('supertest');

/**
 * Gets database name from first console argument
 * creates n (see constants) users
 */
module.exports = async function createTestData(api, server, usersQTY = 10, templatesQTY = 10) {
  /** Users **/
  const users = [];
  for (let i = 0; i < usersQTY; i++) {
    users.push({
      external_id: `test-user-${i}`,
      name: `test-user-${i}`,
      email: `info+test-${i}@joinlane.com`,
      email_status: 'verified',
      // sms: '+1 416-000-0001',
      // sms_status: 'unverified',
      // voice: '+1 416-000-0001',
      // voice_status: 'unverified',
      delivery: ['email'],
      groups: [`test-group-a`, `test-group-b`, `test-group-c`],
      tags: [`test-tag-a`, `test-tag-b`, `test-tag-c`],
    });
  }

  for (let key in users) {
    let user = users[key];
    const res = await request(server).post('/api/user').send(user).set('Accept', 'application/json');
  }
  console.log('[createTestData] created', usersQTY, 'users');

  /** Templates **/
  const templates = [];
  for (let i = 0; i < templatesQTY; i++) {
    templates.push({
      name: `test-template-${i}`,
      email: {
        todo: 'This should be a valid EJS Template',
      },
    });
  }

  for (let key in templates) {
    let template = templates[key];
    const res = await request(server).post('/api/template').send(template).set('Accept', 'application/json');
  }
  console.log('[createTestData] created', templatesQTY, 'templates');
};
