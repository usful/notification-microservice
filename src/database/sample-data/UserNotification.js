const User = require('./User');
const Notification = require('./Notification');

const UserNotification = {
  id: String,
  created: Date,
  updated: Date,
  user: User,
  notification: Notification,
  status: {
    type: String,
    validators: {
      In: ['Delivered', 'Failed']
    }
  }
};

module.exports = UserNotification;