const AWS = require('aws-sdk');
const uuidV4 = require('uuid/v4');
const POLLING_THROTTLE = 1000;

class SQSPoller {
  constructor(SQSConfig) {
    this.SQS = new AWS.SQS(SQSConfig);
    this.pollingSessions = new Map();
  }

  /**
   * Creates the interval that polls the queue specified by the QueueUrl and stores it in a hashmap.
   * Returns the key the created interval is stored under
   * @param QueueUrl
   * @param processMessage
   * @param postProcess
   * @returns {String} todo figure out what type this is
   */
  pollQueue(QueueUrl, { processMessage = () => {}, postProcess = () => {} }) {
    const interval = setInterval(() => {
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
    }, POLLING_THROTTLE);
    const key = uuidV4();
    this.pollingSessions.set(key, interval);
    return key;
  }

  stopPolling(key) {
    clearInterval(this.pollingSessions.get(key));
    this.pollingSessions.delete(key);
  }
}

module.exports = SQSPoller;
