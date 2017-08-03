// const logger = require('../logger');
// const squel = require('squel').useFlavour('postgres');
// const utils = require('../../utils');
const dbClient = require('../../database/poolClient');

function getUserIdsByGroupName(groupName) {
  return dbClient.db.any(
    `
    SELECT ac.external_id
    FROM account_groups ag
    LEFT JOIN account ac
    ON ag.user_id = ac.id
    WHERE ag.group_name = $1
    GROUP BY ac.external_id
  `,
    groupName
  );
}

module.exports = {
  getUserIdsByGroupName,
};
