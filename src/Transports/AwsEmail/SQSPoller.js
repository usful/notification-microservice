const aws = require('aws-sdk');

class SQSPoller {
  constructor(config, queueUrl) {
    //todo adjust config
    this.SQS = new aws.SQS(config.sqs.init_conf);

    this.pollingInterval = config.sqs.pollingInterval;
    this.queueURL = queueUrl;
  }

  async startPolling(processMessage = () => {}) {
    while (true) {
      const QueueUrl = this.queueURL;
      const data = await this.receiveMessage({ QueueUrl });

      if (data.Messages) {
        const message = data.Messages[0];
        message.Body = JSON.parse(message.Body);
        message.deleteRequest = this.SQS.deleteMessage({
          QueueUrl,
          ReceiptHandle: message.ReceiptHandle
        });
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
