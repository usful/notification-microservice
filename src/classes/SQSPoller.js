const aws = require('aws-sdk');

class SQSPoller {
  constructor(config, queueUrl) {
    aws.config.update(config.transports.email);

    this.SQS = new aws.SQS({
      apiVersion: '2012-11-05'
    });

    this.pollingInterval = config.engine.sqsPollingInterval;
    this.queueURL = queueUrl;
    this.interval = null;
  }

  /**
   * Creates the interval that polls the queue specified by the QueueUrl and stores it in a hashmap.
   * Returns the key the created interval is stored under
   * @param processMessage
   * @param postProcess
   */
  startPolling({ processMessage = () => {}, postProcess = () => {} }) {
    const QueueUrl = this.queueURL;
    this.interval = setInterval(() => {
      this.SQS.receiveMessage({ QueueUrl }, (err, data) => {
        if (err) {
          console.log('error occured', err);
        } else {
          if (data.Messages) {
            const message = data.Messages[0];
            processMessage(JSON.parse(message.Body));
            //adds the delete request for the message to the message object exposing it to the postProcess
            message.deleteRequest = this.SQS.deleteMessage({ QueueUrl, ReceiptHandle: message.ReceiptHandle });
            postProcess(message);
          }
        }
      });
    }, this.pollingInterval);
  }

  stopPolling() {
    clearInterval(this.interval);
  }
}

module.exports = SQSPoller;
