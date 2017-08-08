const squel = require('squel').useFlavour('postgres');
const dbClient = require('../database/poolClient');

function getNextNotificationAndMarkAsProcessing() {
  return dbClient.db.oneOrNone(
    `
    WITH next_notif AS (
      SELECT *
      FROM notification
      WHERE notification.at <= NOW() AND
      notification.status = 'new'
      ORDER BY notification.at
      LIMIT 1
      FOR UPDATE
    )
    UPDATE notification notifs
    SET status = 'processing'
    FROM next_notif
    WHERE notifs.id = next_notif.id
    RETURNING next_notif.*`
  );
}

function markNotificationAsSent(notification_id) {
  return dbClient.db.one(
    `
      UPDATE notification
      SET status = 'sent'
      WHERE notification.id = $1
      returning notification.id
    `,
    notification_id
  );
}

function markNotificationAsFailed(notification_id) {
  return dbClient.db.one(
    `
      UPDATE notification
      SET status = 'failed'
      WHERE notification.id = $1
      returning notification.id
    `,
    notification_id
  );
}

module.exports = {
  getNextNotificationAndMarkAsProcessing,
  markNotificationAsSent,
  markNotificationAsFailed,
};
