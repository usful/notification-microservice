const logger = require('../logger');
const dbClient = require('../../database/poolClient');

function createWebhook(url, transport) {
  return dbClient.db.one(
    `
    INSERT INTO webhook
    (url, transport)
    VALUES
    ($1, $2)
    RETURNING *
  `,
    [url, transport]
  );
}

function getWebhooks() {
  return dbClient.db.any(
    `
    SELECT * FROM webhook
    `
  );
}

function deleteWebhook(url) {
  return dbClient.db.oneOrNone(
    `
    DELETE FROM webhook
    WHERE url = $1
    RETURNING *
    `,
    url
  );
}

module.exports = {
  createWebhook,
  getWebhooks,
  deleteWebhook,
};
