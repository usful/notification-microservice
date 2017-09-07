const request = require('supertest');
const expect = require('chai').expect;

/**
 * Gets database name from first console argument
 * creates n (see constants) users
 */
module.exports = async function createTestData(api, server, usersQTY = 10, templatesQTY = 10, notificationsQTY = 10) {
  /** Users **/
  const users = [];
  for (let i = 0; i < usersQTY; i++) {

    const groups = ['group-a', 'group-b', 'group-c'];
    const tags = ['tag-a', 'tag-b', 'tag-c'];
    if (i % 2 === 0) {
      groups.push('group-pair');
      tags.push('tag-pair');
    } else {
      groups.push('group-none');
      tags.push('tag-none');
    }

    users.push({
      external_id: `user-${i}`,
      name: `test-user-${i}`,
      email: `info+test-${i}@joinlane.com`,
      email_status: 'verified',
      // sms: '+1 416-000-0001',
      // sms_status: 'unverified',
      // voice: '+1 416-000-0001',
      // voice_status: 'unverified',
      delivery: ['email'],
      groups,
      tags,
    });
  }

  for (let key in users) {
    let user = users[key];
    let res;
    try {
      res = await request(server).post('/api/user').send(user).set('Accept', 'application/json');
      expect(res.status).to.equal(200);
    } catch (error) {
      console.error('res body', res.body);
      throw new Error(error.message);
    }
  }
  console.log('[createTestData] created', usersQTY, 'users');

  /** Templates **/
  const templates = [];
  for (let i = 0; i < templatesQTY; i++) {
    templates.push({
      name: `test-template-${i}`,
      email: {
        subject: 'hello <%= data.username %>',
        text: '<title>This is html content</title><body>and here is a number <%= data.num %> cheers!</body>',
      },
    });
  }

  for (let key in templates) {
    let template = templates[key];
    let res;
    try {
      res = await request(server).post('/api/template').send(template).set('Accept', 'application/json');
      expect(res.status).to.equal(200);
    } catch (error) {
      console.error('res body', res.body);
      throw new Error(error.message);
    }
  }
  console.log('[createTestData] created', templatesQTY, 'templates');

  /** Notifications **/
  const notifications = [];
  for (let i = 0; i < notificationsQTY; i++) {
    notifications.push({
      by: ['email'],
      at: Math.floor(Date.now() / 1000),
      template_id: 1,
      users: [`user-1`],
      groups: [`group-a`],
      tags: [`tag-pair`],
      required_by: ['email'],
      data: {
        username: `random-username-${i}`,
        num: 30,
      },
    });
  }

  for (let key in notifications) {
    let notification = notifications[key];
    let res;
    try {
      res = await request(server).post('/api/notification').send(notification).set('Accept', 'application/json');
      expect(res.status).to.equal(200);
    } catch (error) {
      console.error('res body', res.body);
      throw new Error(error.message);
    }
  }
  console.log('[createTestData] created', notificationsQTY, 'notifications');
};
