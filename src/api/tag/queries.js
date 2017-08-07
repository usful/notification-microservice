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
    tagName
  );
}

function addUserTag(userId, tagName) {
  return dbClient.db.none(
    `
    INSERT INTO account_tags
    (user_id, tag_name)
    VALUES
    ($1, $2)
    `,
    [userId, tagName]
  );
}

function deleteUserTag(userId, tagName) {
  return dbClient.db.oneOrNone(
    `
    DELETE
    FROM account_tags
    WHERE
      account_tags.user_id = $1 AND
      account_tags.tag_name = $2
    RETURNING *;
    `,
    [userId, tagName]
  );
}

module.exports = {
  getUserIdsByTagName,
  addUserTag,
  deleteUserTag,
};
