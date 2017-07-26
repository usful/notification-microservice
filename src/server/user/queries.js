const winston = require('winston');
const squel = require('squel').useFlavour('postgres');
const utils = require('../utils');
const db = require('../../database/client');

function getUserByExternalId(external_id) {
  return db.oneOrNone(
    `
    SELECT ac.*, array_agg(ug.group_name)
    FROM account ac
    LEFT JOIN user_groups ug
    ON ac.id = ug.user_id
    WHERE ac.external_id = $1
    GROUP BY ac.id
  `,
    external_id
  );
}

function getUsersByGroup(group_name) {
  return db.manyOrNone(
    `
    SELECT ac.*, array_agg(ug.group_name)
    FROM user_groups ug
    LEFT JOIN account ac
    ON ug.user_id = ac.id
    WHERE ug.group_name = $1
    GROUP BY ac.id;
  `,
    group_name
  );
}

function deleteUserByExternalId(external_id) {
  return db.one('DELETE FROM account where external_id = $1 returning id', external_id);
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
    baseQuery.set('delivery', utils.pgArr(delivery));
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
    baseQuery.set('timezone', active);
  }

  winston.info('[Query]', baseQuery.toString());
  return db.one(baseQuery.toString());
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
    baseQuery.set('delivery', utils.pgArr(delivery));
  }

  if (timezone) {
    baseQuery.set('timezone', timezone);
  }

  if (language) {
    baseQuery.set('language', language);
  }

  if (active || active == false) {
    baseQuery.set('timezone', active);
  }

  winston.info('[Query]', baseQuery.toString());

  return db.oneOrNone(baseQuery.toString());
}

function addUserGroups(user_id, groups) {
  const query = squel.insert().into('user_groups').setFieldsRows(groups.map(group_name => ({ user_id, group_name })));

  winston.info('[Query]', query.toString());
  return db.none(query.toString());
}

function deleteUserGroups(user_id) {
  return db.none(`DELETE FROM user_groups where user_id = $1`, user_id);
}

function deleteUserNotifications(user_id) {
  return db.none(`DELETE FROM notification_users where user_id = $1`, user_id);
}

module.exports = {
  getUserByExternalId,
  getUsersByGroup,
  createUser,
  updateUser,
  addUserGroups,
  deleteUserGroups,
  deleteUserByExternalId,
  deleteUserNotifications,
};
