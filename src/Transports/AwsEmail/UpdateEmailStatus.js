const squel = require('squel');

const SQSPoller = require('./SQSPoller');

const poolClient = require('../../database/poolClient');
const config = require('../../config/index');
poolClient.connect(config.db);
const db = poolClient.db;

const webhooks = new require('../../Webhooks')(db);

const bounceQueuePoller = new SQSPoller(config, config.sqs.bounceQueue);
const complaintQueuePoller = new SQSPoller(config, config.sqs.complaintQueue);
const deliveredQueuePoller = new SQSPoller(config, config.sqs.deliveredQueue);

const setEmailStatus = (users, updateQuery) => {
  for (let user of users) {
    const updateEmailStatusQuery = updateQuery.where('email = ?', user.emailAddress).toString();
    db.none(updateEmailStatusQuery);
  }
};

const bounceHandler = messageData => {
  const bounce = JSON.parse(messageData.Body.Message).bounce;
  const recipients = bounce.bouncedRecipients;
  //if bounceType is Permanent then it was a hard bounce. Else it was a soft bounce.
  const status = bounce.bounceType === 'Permanent' ? 'bounced' : 'failed';
  const updateQuery = squel.update().table('account').set('email_status', status).where('email_status != ?', status);
  setEmailStatus(recipients, updateQuery);
  webhooks.fire('UserDeliveryFailed', messageData);
  messageData.deleteRequest.send();
};

const complaintHandler = messageData => {
  const recipients = JSON.parse(messageData.Body.Message).complaint.complainedRecipients;
  const updateQuery = squel.update().table('account').set('email_status', 'failed').where('email_status != failed');
  setEmailStatus(recipients, updateQuery);
  webhooks.fire('UserDeliveryFailed', messageData);
  messageData.deleteRequest.send();
};

const deliveredHandler = messageData => {
  webhooks.fire('UserDeliveryConfirmed', messageData);
  messageData.deleteRequest.send();
};

bounceQueuePoller.startPolling(bounceHandler);
complaintQueuePoller.startPolling(complaintHandler);
deliveredQueuePoller.startPolling(deliveredHandler);
