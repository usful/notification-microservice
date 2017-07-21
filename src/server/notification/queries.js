const db = require('../../../database/client')

function getNotificationById(id) {
  return db.oneOrNone(
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
  )
}

function getNotificationsSent() {
  return db.any(
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
  )
}

function getNotificationsUnsent() {
  return db.any(
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
  )
}

module.exports = {
  getNotificationById,
  getNotificationsSent,
  getNotificationsUnsent,
}
