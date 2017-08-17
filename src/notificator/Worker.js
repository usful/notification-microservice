const { Writable } = require('stream');
const QueryStream = require('pg-query-stream');
const JSONStream = require('JSONStream');
const es = require('event-stream')
const _ = require('lodash');

const Worker = require('./Tasker/Worker');
const logger = require('./logger');

const config = require('../config');
const constants = require('../constants');

const dbClient = require('../database/poolClient');

const EmailTransport = require('../Transports/AwsEmail/AwsEmailTransport');
const PushTransport = require('../Transports/FCMPush/PushTransport');
const VoiceTransport = require('../Transports/VoiceTransport');
const WebTransport = require('../Transports/WebTransport');
const SMSTransport = require('../Transports/TwilioSMS/SMSTransport');

const EJSTemplate = require('../Templates/EJSTemplate');

const Templates = {
  ejs: EJSTemplate,
};

const Transports = {
  email: new EmailTransport(config),
  // push: new PushTransport(config),
  // voice: new VoiceTransport(config),
  // web: new WebTransport(config),
  // sms: new SMSTransport(config)
};

class MyWorker extends Worker {
  constructor() {
    super();
    dbClient.connect(config.db);
  }

  async processData({ notification }) {
    // Output to the console so we know some work is being done.
    logger.info('[Worker]', worker.whoAmI, 'got data', notification);

    // Load the template for this notification.
    const Template = Templates['ejs'];
    const template = new Template(notification.template_id, dbClient);
    await template.load(); // TODO: Handle not found error as hard error

    // Get the users for this notification
    // Get all users in the notification.users field
    // Get all the users that belong to each group of the groups field
    // Filter out only users who have the tags in the tags field (if provided)

    const usersQs = new QueryStream('SELECT * FROM account');

    const consumerStream = new Writable({
      objectMode: true,
      write(user, encoding, callback) {
        logger.info('Sending message to user', user.name);

        // const messages = [];
        for (let transportName of notification.by) {
          let message;
          try {
            logger.info('rendering message', { transportName, user, data: notification.data });
            message = template.render({ transportName, user, data: notification.data });
          } catch (error) {
            // TODO: handle error as hard error
            console.error('[Worker] failed to compile template with good user for delivery -', delivery);
            console.log(error);
            throw error;
          }

          console.log(' Rendered message ======> ');
          console.log(message);
          console.log('<============');
        }

        callback();
      },
    });

    let res
    try {
      await dbClient.db.stream(usersQs, s => s.pipe(consumerStream));
    } catch(error) {
      console.error('[Worker] failed sending notification')
      throw error;
    }
  }
}

const worker = new MyWorker();
