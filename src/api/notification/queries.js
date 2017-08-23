const logger = require('../logger');
const squel = require('squel').useFlavour('postgres');
const util = require('../../lib/util');
const dbClient = require('../../database/poolClient');

function getNotificationById(id) {
  return dbClient.db.oneOrNone(
    `
    SELECT notif.*, users_arrs.users as users
    FROM notification notif
    LEFT JOIN (
      SELECT notif_usrs.notification_id, array_agg(acc.external_id::int) as users
      FROM notification_users notif_usrs
      LEFT JOIN account acc
      ON notif_usrs.user_id = acc.id
      GROUP BY notif_usrs.notification_id
    ) users_arrs
    ON notif.id = users_arrs.notification_id
    WHERE notif.id = $1
    `,
    id
  );
}

function getNotificationsSent() {
  return dbClient.db.any(
    `
    SELECT notif.*, users_arrs.users as users
    FROM notification notif
    LEFT JOIN (
      SELECT notif_usrs.notification_id, array_agg(acc.external_id::int) as users
      FROM notification_users notif_usrs
      LEFT JOIN account acc
      ON notif_usrs.user_id = acc.id
      GROUP BY notif_usrs.notification_id
    ) users_arrs
    ON notif.id = users_arrs.notification_id
    WHERE notif.sent IS NOT NULL
    `
  );
}

function getNotificationsUnsent() {
  return dbClient.db.any(
    `
    SELECT notif.*, users_arrs.users as users
    FROM notification notif
    LEFT JOIN (
      SELECT notif_usrs.notification_id, array_agg(acc.external_id::int) as users
      FROM notification_users notif_usrs
      LEFT JOIN account acc
      ON notif_usrs.user_id = acc.id
      GROUP BY notif_usrs.notification_id
    ) users_arrs
    ON notif.id = users_arrs.notification_id
    WHERE notif.sent IS NULL
    `
  );
}

function createNotification(by, at, template_id, users, groups, tags, required_by, data) {
  const query = squel
    .insert()
    .into('notification')
    .set('by', util.pgArr(by))
    .set('at', squel.rstr(`to_timestamp(${at})`))
    .set('template_id', template_id)
    .returning('*');

  if (users) {
    query.set('users', util.pgArr(users));
  }

  if (groups) {
    query.set('groups', util.pgArr(groups));
  }

  if (tags) {
    query.set('tags', util.pgArr(tags));
  }

  if (required_by) {
    query.set('required_by', util.pgArr(required_by));
  }

  if (data) {
    query.set('data', JSON.stringify(data));
  }

  logger.info('[Query]', query.toString());
  return dbClient.db.one(query.toString());
}

// function getUserIdsFromExternalIds(idsArr) {
//   console.log('WEWEEW', idsArr);
//   return dbClient.db.one('SELECT array_agg(id::int) as ids FROM account WHERE external_id IN ($1:csv)', [idsArr]);
// }

function insertNotificationUsers(notification_id, user_ids) {
  const notificationUsersQuery = squel.insert().into('notification_users').setFieldsRows(
    user_ids.map(user_id => ({
      notification_id,
      user_id,
    }))
  );
  logger.info('[Query]', notificationUsersQuery.toString());
  return dbClient.db.none(notificationUsersQuery.toString());
}

function updateNotification({ id, by, at, template_id, required_by, data, status }) {
  const baseQuery = squel.update().table('notification').where('id = ?', id).returning('*');

  if (by) {
    baseQuery.set('by', util.pgArr(by));
  }

  if (at) {
    baseQuery.set('at', squel.rstr(`to_timestamp(${at})`));
  }

  if (template_id) {
    baseQuery.set('template_id', template_id);
  }

  if (required_by) {
    baseQuery.set('required_by', email);
  }

  if (data) {
    baseQuery.set('sms', data);
  }

  if (status) {
    baseQuery.set('status', status);
  }

  logger.info('[Query]', baseQuery.toString());
  return dbClient.db.oneOrNone(baseQuery.toString());
}

function deteleNotificationUsers(id) {
  return dbClient.db.none('DELETE FROM notification_users where notification_id = $1', id);
}

module.exports = {
  getNotificationById,
  getNotificationsSent,
  getNotificationsUnsent,
  createNotification,
  // getUserIdsFromExternalIds,
  insertNotificationUsers,
  updateNotification,
  deteleNotificationUsers,
};
