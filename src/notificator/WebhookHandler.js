const http = require('http');
const squel = require('squel');
const url = require('url');
const util = require('../lib/util');
const poolClient = require('../database/poolClient');
const config = require('../config');

//Abstraction of a webhook
module.exports = class WebhookHandler {
  constructor(eventString) {
    //event string enum e.x: 'NotificationFailed'
    this.event = eventString;
    this.ready = false;
    this.setup();
  }

  /**
   * Function to set up the handler by loading correct webhooks for its associated event.
   * Can also be used to update the handler upon registering/deregistering a webhook to an event.
   * @returns {Promise.<void>}
   */
  async setup() {
    //Connect to db and load all the webhooks required to fire due to event.
    await poolClient.connect(config.db);

    const db = poolClient.db;
    const query = squel.select().from('webhook').where('type = ?', this.event).toString();

    this.webhooks = await db.manyOrNone(query);

    this.ready = true;
  }

  /**
   * Fires all webhooks loaded from setup. Takes data to pass with the webhook.
   * @param data
   * @returns {Promise.<void>}
   */
  async fire(data) {
    while (!this.ready) {
      util.pause(100);
    }
    const post_data = JSON.stringify(data);

    for (let webhook of this.webhooks) {
      const url_info = url.parse(webhook.url);
      const post_options = {
        host: url_info.host,
        port: '80',
        path: url_info.path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(post_data)
        }
      };
      const post_req = http.request(post_options, (res) => {
        res.setEncoding('utf8');
        res.on('data', (data) => {
          console.log('Response:', data)
        });
      });

      post_req.write(post_data);
      post_req.end();
    }
  }
};
