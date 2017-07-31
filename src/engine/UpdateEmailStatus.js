const SQSPoller = require('../classes/SQSPoller');
const db = require('../database/client');
const squel = require('squel');
const config = require('../config');

const poller = new SQSPoller(config.transports.email);

const postProcess = message => {
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
  //if bounceType is Permanent then it was a hard bounce. Else it was a soft bounce.
  const status = bounce.bounceType === 'Permanent' ? 'bounced' : 'failed';
  const updateQuery = squel.update().table('account').set('email_status', status).where('email_status != ?', status);
  setEmailStatus(recipients, updateQuery);
};

const complaintHandler = data => {
  const recipients = JSON.parse(data.Message).complaint.complainedRecipients;
  const updateQuery = squel.update().table('account').set('email_status', 'failed').where('email_status != failed');
  setEmailStatus(recipients, updateQuery);
};

poller.pollQueue(config.AWS.SQS.ComplaintsURL, { processMessage: complaintHandler, postProcess });
poller.pollQueue(config.AWS.SQS.BounceURL, { processMessage: bounceHandler, postProcess });
