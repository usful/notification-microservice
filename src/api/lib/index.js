const config = require('../../config');
const userApi = require('./user-api')(config.api.port);
const groupApi = require('./group-api')(config.api.port);
const tagApi = require('./tag-api')(config.api.port);
const webhookApi = require('./webhook-api')(config.api.port);
const templateApi = require('./template-api')(config.api.port);
const notificationApi = require('./notification-api')(config.api.port);

module.exports = Object.assign({},
  userApi,
  groupApi,
  tagApi,
  webhookApi,
  templateApi,
  notificationApi
);
