const logger = require('../logger');
const squel = require('squel').useFlavour('postgres');
const util = require('../../lib/util');
const dbClient = require('../../database/poolClient');

/** TODO: One query to get the user with its groups and tags

// Not working
WITH account_g AS (
  SELECT ac.*, array_agg(ag.group_name) groups
  FROM account ac
  LEFT JOIN account_groups ag
  ON ac.id = ag.user_id
  WHERE ac.id = 1
  GROUP BY ac.id
)
SELECT acc.id, array_agg(acc.groups) groups, array_agg(acc.active), array_agg(a_t.tag_name) tags
FROM account_g acc
LEFT JOIN account_tags a_t
ON acc.id = a_t.user_id
GROUP BY acc.id;

// Working getting just groups
SELECT ac.*, array_agg(ug.group_name)
FROM account ac
LEFT JOIN account_groups ug
ON ac.id = ug.user_id
WHERE ac.external_id = $1
GROUP BY ac.id
**/

function getUserByExternalId(external_id) {
  return dbClient.db.oneOrNone(
    `
    SELECT ac.*
    FROM account ac
    WHERE ac.external_id = $1
  `,
    external_id
  );
}

function getUserGroupsById(user_id) {
  return dbClient.db.oneOrNone(
    `
    SELECT array_agg(account_groups.group_name) groups
    FROM account_groups
    WHERE user_id = $1
    GROUP BY user_id
    `,
    user_id
  );
}

function getUserTagsById(user_id) {
  return dbClient.db.oneOrNone(
    `
    SELECT array_agg(account_tags.tag_name) tags
    FROM account_tags
    WHERE user_id = $1
    GROUP BY user_id
    `,
    user_id
  );
}

// TODO: Include groups and tags
function getUsersByGroup(group_name) {
  return dbClient.db.manyOrNone(
    `
    SELECT ac.*, array_agg(ug.group_name)
    FROM account_groups ug
    LEFT JOIN account ac
    ON ug.user_id = ac.id
    WHERE ug.group_name = $1
    GROUP BY ac.id;
  `,
    group_name
  );
}

function deleteUserByExternalId(external_id) {
  return dbClient.db.one('DELETE FROM account where external_id = $1 returning id', external_id);
}

function createUser({ external_id, name, email, sms, voice, delivery, timezone, language, active }) {
  const baseQuery = squel.insert().into('account').set('external_id', external_id).set('name', name).returning('*');

  if (email) {
    baseQuery.set('email', email);
  }

  if (sms) {
    baseQuery.set('sms', sms);
  }

  if (voice) {
    baseQuery.set('voice', voice);
  }

  if (delivery) {
    baseQuery.set('delivery', util.pgArr(delivery));
  }

  if (timezone) {
    baseQuery.set('timezone', timezone);
  }

  if (language) {
    baseQuery.set('language', language);
  } else {
    baseQuery.set('language', 'en');
  }

  if (active || active == false) {
    baseQuery.set('active', active);
  }

  logger.info('[Query]', baseQuery.toString());
  return dbClient.db.one(baseQuery.toString());
}

function updateUser({ external_id, name, email, sms, voice, delivery, timezone, language, active }) {
  const baseQuery = squel.update().table('account').where('external_id = ?', external_id).returning('*');

  if (name) {
    baseQuery.set('name', name);
  }

  if (email) {
    baseQuery.set('email', email);
  }

  if (sms) {
    baseQuery.set('sms', sms);
  }

  if (voice) {
    baseQuery.set('voice', voice);
  }

  if (delivery) {
    baseQuery.set('delivery', util.pgArr(delivery));
  }

  if (timezone) {
    baseQuery.set('timezone', timezone);
  }

  if (language) {
    baseQuery.set('language', language);
  }

  if (active || active == false) {
    baseQuery.set('active', active);
  }

  logger.info('[Query]', baseQuery.toString());

  return dbClient.db.oneOrNone(baseQuery.toString());
}

function addUserGroups(user_id, groups) {
  const query = squel
    .insert()
    .into('account_groups')
    .setFieldsRows(groups.map(group_name => ({ user_id, group_name })));

  logger.info('[Query]', query.toString());
  return dbClient.db.none(query.toString());
}

function addUserTags(user_id, tags) {
  const query = squel.insert().into('account_tags').setFieldsRows(tags.map(tag_name => ({ user_id, tag_name })));

  logger.info('[Query]', query.toString());
  return dbClient.db.none(query.toString());
}

function deleteUserGroups(user_id) {
  return dbClient.db.none(`DELETE FROM account_groups where user_id = $1`, user_id);
}

function deleteUserTags(user_id) {
  return dbClient.db.none(`DELETE FROM account_tags where user_id = $1`, user_id);
}

function deleteUserNotifications(user_id) {
  return dbClient.db.none(`DELETE FROM notification_users where user_id = $1`, user_id);
}

module.exports = {
  getUserByExternalId,
  getUserGroupsById,
  getUserTagsById,
  getUsersByGroup,
  createUser,
  updateUser,
  addUserGroups,
  addUserTags,
  deleteUserGroups,
  deleteUserTags,
  deleteUserByExternalId,
  deleteUserNotifications,
};
