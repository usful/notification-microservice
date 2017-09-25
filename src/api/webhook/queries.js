const logger = require('../logger');
const dbClient = require('../../database/poolClient');

function createWebhook(url, transport, type) {
  return dbClient.db.one(
    `
    INSERT INTO webhook
    (url, transport, type)
    VALUES
    ($1, $2, $3)
    RETURNING *
  `,
    [url, transport, type]
  );
}

function getWebhooks() {
  return dbClient.db.any(
    `
    SELECT * FROM webhook
    `
  );
}

function getWebhook(url) {
  return dbClient.db.one(
    `
    SELECT * FROM webhook WHERE url=$1
    `,
    [url]
  )
}

function updateWebhook({url, transport, type}) {
  return dbClient.db.oneOrNone(
    ` UPDATE FROM webhook
      ${transport ? `SET transport=${transport}`: ''}
      ${type ? `SET type=${type}`: ''}
      WHERE url=$1
      RETURNING *;
    `,
    url
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
  updateWebhook,
};
