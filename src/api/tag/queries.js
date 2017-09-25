// const logger = require('../logger');
// const squel = require('squel').useFlavour('postgres');
// const utils = require('../../utils');
const dbClient = require('../../database/poolClient');

function getUserIdsByTagName(tagName) {
  return dbClient.db.any(
    `
    SELECT ac.external_id
    FROM account_tags ag
    LEFT JOIN account ac
    ON ag.user_id = ac.id
    WHERE ag.tag_name = $1
    GROUP BY ac.external_id
  `,
    [tagName]
  );
}

function deleteTag(tagName) {
  return dbClient.db.any(
    `
     DELETE FROM account_tags
     WHERE tag_name = $1
     RETURNING *
    `,
    [tagName]
  );
}

module.exports = {
  getUserIdsByTagName,
  deleteTag,
};
