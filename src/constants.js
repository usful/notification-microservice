// NOTICE: arrays representing enums should be the same as in schema.sql
module.exports = {
  verification_status: ['verified', 'bounced', 'failed', 'unverified'],
  delivery_type: ['email', 'sms', 'push', 'voice', 'web'],
  webhook_type: ['NotificationFailed', 'NotificationSuccess', 'UserDeliveryFailed', 'UserDeliveryConfirmed', 'SystemError'],
  notification_status: ['new', 'failed', 'sent', 'processing'],
  good_user: {
    id: 0,
    external_id: 'good id 123@',
    name: 'good user 123@',
    email: 'good_user@template.com',
    email_status: 'unverified',
    sms: '+1 416-000-0000',
    sms_status: 'verified',
    voice: 'voice',
    voice_status: 'verified',
    delivery: '{email,sms,voice}',
    language: 'en',
    timezone: 'America/Toronto',
    active: true
  }
};
