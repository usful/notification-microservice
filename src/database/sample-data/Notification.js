const GeoJSON = require('./GeoJSON');
const User = require('./User');
const Template = require('./Template');

const Notification = {
  id: String,
  created: Date,
  updated: Date,
  by: {
    type: [String],
    validators: {
      In: ['Email', 'SMS', 'Push', 'Voice', 'Web']
    }
  },
  requiredBy: {
    type: [String],
    validators: {
      In: ['Email', 'SMS', 'Push', 'Voice', 'Web']
    }
  },
  at: Date,
  useUserLocale: Boolean,
  geo: GeoJSON,
  groups: [String],
  tags: [String],
  users: [User], //reference to Users by id
  template: Template, //reference to a Template by id
  data: Object,
  sent: Date,
};

module.exports = Notification;