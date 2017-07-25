// NOTICE: arrays representing enums should be the same as in schema.sql
module.exports = {
  verification_status: ['verified', 'bounced', 'failed', 'unverified'],
  delivery_type: ['email', 'sms', 'push', 'voice', 'web'],
  notification_status: ['new', 'failed', 'sent', 'processing'],
};
