// const logger = require('../logger');
// const squel = require('squel').useFlavour('postgres');
// const utils = require('../../utils');
const dbClient = require('../../database/poolClient');

/**
 * Gets all userIds in a group
 * @param groupName
 * @returns {*|XPromise<IArrayExt<any>>|external:Promise.<Array>}
 */
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

/**
 * Adds a user to a group
 * @param userId
 * @param groupName
 * @returns {XPromise<void>|external:Promise.<null>|*}
 */
function addUserGroup(userId, groupName) {
  return dbClient.db.none(
    `
    INSERT INTO account_groups
    (user_id, group_name)
    VALUES
    ($1, $2)
    `,
    [userId, groupName]
  );
}

/**
 * Deletes a user from a group
 * @param userId
 * @param groupName
 * @returns {XPromise<any>|external:Promise}
 */
function deleteUserGroup(userId, groupName) {
  return dbClient.db.oneOrNone(
    `
    DELETE
    FROM account_groups
    WHERE
      account_groups.user_id = $1 AND
      account_groups.group_name = $2
    RETURNING *;
    `,
    [userId, groupName]
  );
}

/**
 * Deletes all users from a group
 * @param groupName
 * @returns {XPromise<any>|external:Promise}
 */
function deleteGroup(groupName) {
  return dbClient.db.any(
    `
    DELETE
    FROM account_groups
    WHERE
      account_groups.group_name = $1
    RETURNING *;
    `,
    [groupName]
  );
}

module.exports = {
  getUserIdsByGroupName,
  addUserGroup,
  deleteUserGroup,
  deleteGroup,
};
