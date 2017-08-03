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
      const data = await this.receiveMessage({ QueueUrl });
      if (data.Messages) {
        const message = data.Messages[0];
        message.Body = JSON.parse(message.Body);
        message.deleteRequest = this.SQS.deleteMessage({ QueueUrl, ReceiptHandle: message.ReceiptHandle });
        await processMessage(message);
      } else {
        await new Promise(resolve => setTimeout(resolve, this.pollingInterval));
      }
    }
  }

  receiveMessage(sqsOptions) {
    return new Promise((resolve, reject) => {
      this.SQS.receiveMessage(sqsOptions, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
      });
    });
  }
}

module.exports = SQSPoller;
