module.exports = {
  email: {
    AWSAccessKeyID: process.env.TPS_EMAIL_AWS_ACCESS_KEY_ID,
    AWSSecretKey: process.env.TPS_EMAIL_AWS_SECRET_KEY,
    from: process.env.TPS_EMAIL_FROM,
    region: process.env.AWS_REGION,
  },
  push: {
    serviceAccountKeyPath: process.env.SERVICE_ACCOUNT_KEY_PATH,
    dbUrl: process.env.FCM_DB_URL,
    messagingOptions: {},
  },
  sms: {
    accountSid: process.env.TWILLIO_SID,
    authToken: process.env.TWILLIO_AUTH_TOKEN,
    from: process.env.TWILLIO_NUM,
  },
};
