const GeoJSON = require('./GeoJSON');

const User = {
  id: String,
  created: Date,
  updated: Date,
  name: String,
  email: {
    type: String,
    validators: {
      Email: true
    }
  },
  emailStatus: {
    type: String,
    validators: {
      In: ['Verified', 'Bounced', 'Failed', 'Unverified']
    }
  },
  sms: {
    type: String,
    validators: {
      PhoneNumber: true
    }
  },
  smsStatus: {
    type: String,
    validators: {
      In: ['Verified', 'Bounced', 'Failed', 'Unverified']
    }
  },
  voice: {
    type: String,
    validators: {
      PhoneNumber: true
    }
  },
  voiceStatus: {
    type: String,
    validators: {
      In: ['Verified', 'Bounced', 'Failed', 'Unverified']
    }
  },
  delivery: {
    type: [String],
    validators: {
      In: ['Email', 'SMS', 'Push', 'Voice', 'Web']
    }
  },
  language: String,
  timeZone: String,
  geo: GeoJSON,
  active: Boolean,
  groups: [String],
  tags: [String],
};

module.exports = User;