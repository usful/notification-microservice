const SQSPoller = require('../classes/SQSPoller');
const db = require('../database/client');
const squel = require('squel');

//This info should be in a config or something.
const poller = new SQSPoller({
  apiVersion: '2012-11-05',
  accessKeyId: 'AKIAIE3OBRX7IXSOYP3A',
  secretAccessKey: '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',
  region: 'us-east-1',
});
const SQS_BOUNCE_URL = 'https://sqs.us-east-1.amazonaws.com/686888558054/ses-bounce';
const SQS_COMPLAINT_URL = 'https://sqs.us-east-1.amazonaws.com/686888558054/ses-complaints';

const postProcess = message => {
  //use this for webhooks?
  message.deleteRequest.send();
};

const setEmailStatus = (users, updateQuery) => {
  for (let index in users) {
    const updateEmailStatusQuery = updateQuery.where('email = ?', users[index].emailAddress).toString();
    db.none(updateEmailStatusQuery);
  }
};

const bounceHandler = data => {
  const bounce = JSON.parse(data.Message).bounce;
  const recipients = bounce.bouncedRecipients;
  const status = bounce.bounceType === 'Permanent' ? 'bounced' : 'failed';
  const updateQuery = squel.update().table('account').set('email_status', status).where('email_status != ?', status);
  setEmailStatus(recipients, updateQuery);
};

const complaintHandler = data => {
  const recipients = JSON.parse(data.Message).complaint.complainedRecipients;
  const updateQuery = squel.update().table('account').set('email_status', 'failed').where('email_status != failed');
  setEmailStatus(recipients, updateQuery);
};

poller.pollQueue(SQS_COMPLAINT_URL, { processMessage: complaintHandler, postProcess });
poller.pollQueue(SQS_BOUNCE_URL, { processMessage: bounceHandler, postProcess });
