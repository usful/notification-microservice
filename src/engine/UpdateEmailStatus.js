const SQSPoller = require('../classes/SQSPoller');
const db = require('../database/client');
const squel = require('squel');
const config = require('../config');

const bounceQueuePoller = new SQSPoller(config, config.AWS.SQS.BounceURL);
const complaintQueuePoller = new SQSPoller(config, config.AWS.SQS.ComplaintsURL);

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

bounceQueuePoller.startPolling({processMessage: bounceHandler, postProcess});
complaintQueuePoller.startPolling({processMessage: complaintHandler, postProcess});