const http = require('http');
const EventEmitter = require('events');
const squel = require('squel');
const url = require('url');
const logger = require('../notificator/logger');

//Abstraction of a collection of webhooks by related event
module.exports = class Webhooks extends EventEmitter {
  constructor(db) {
    super();
    this.db = db;
    this.on('fireWebhooks', (eventString, data = {}) => this.fire(eventString, data)) ;
  }

  async fire(eventString, data) {
    logger.info('[Webhooks] loading webhooks for', eventString);
    const query = squel.select().from('webhook').where('type @> ARRAY[?]::webhook_type[]', eventString).toString();

    const webhooks = await this.db.manyOrNone(query);
    logger.info('[Webhooks] loaded webhooks', webhooks);

    logger.info('[Webhooks] firing webhooks');
    const post_data = JSON.stringify(data);

    for (let webhook of webhooks) {
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
          logger.info('[Webhooks] response data', data)
        });
      });

      post_req.write(post_data);
      post_req.end();
    }
  }
};