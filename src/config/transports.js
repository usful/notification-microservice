const path = require('path');
module.exports = {
  email: {
    AWSAccessKeyID: process.env.TPS_EMAIL_AWS_ACCESS_KEY_ID,
    AWSSecretKey: process.env.TPS_EMAIL_AWS_SECRET_KEY,
    from: 'info@joinlane.com',
    region: 'us-east-1',
  },
  push: {
    serviceAccountKeyPath: path.join(process.cwd() ,process.env.SERVICE_ACCOUNT_KEY_PATH),
    dbUrl: 'https://todos-lane.firebaseio.com/',
    messagingOptions: {},
  },
  sms: {
    accountSid: process.env.TWILLIO_SID,
    authToken: process.env.TWILLIO_AUTH_TOKEN,
    from: process.env.TWILLIO_NUM,
  },
};
