const aws = require('aws-sdk');

class SQSPoller {
  constructor(config, queueUrl) {
    this.SQS = new aws.SQS({
      accessKeyId: config.transports.email.AWSAccessKeyID,
      secretAccessKey: config.transports.email.AWSSecretKey,
      region: config.transports.email.region,
      apiVersion: '2012-11-05',
    });

    this.pollingInterval = config.engine.sqsPollingInterval;
    this.queueURL = queueUrl;
  }

  async startPolling(processMessage = () => {}) {
    while (true) {
      const QueueUrl = this.queueURL;
      this.SQS.receiveMessage({ QueueUrl }, (err, data) => {
        if (err) {
          console.log('error occured', err);
        } else {
          if (data.Messages) {
            const message = data.Messages[0];
            message.Body = JSON.parse(message.Body);
            message.deleteRequest = this.SQS.deleteMessage({ QueueUrl, ReceiptHandle: message.ReceiptHandle });
            processMessage(message);
          }
        }
      });
      await new Promise(resolve => setTimeout(resolve, this.pollingInterval));
    }
  }

}

module.exports = SQSPoller;
