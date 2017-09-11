module.exports = {
  email: {
    AWSAccessKeyID: process.env.TPS_EMAIL_AWS_ACCESS_KEY_ID,
    AWSSecretKey: process.env.TPS_EMAIL_AWS_SECRET_KEY,
  },
  push: {
    serviceAccountKeyPath: process.env.serviceAccountKeyPath,
    dbUrl: process.env.fcm_db_url,
    messagingOptions: {},
  },
  sms: {
    accountSid: process.env.accountSid,
    authToken: process.env.authToken,
    from: process.env.twilio_Num,
  },
};
