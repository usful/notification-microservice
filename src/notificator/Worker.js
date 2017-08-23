const pg = require('pg');
const QueryStream = require('pg-query-stream');

const EmailTransport = require('./Transports/AwsEmail/AwsEmailTransport');
const PushTransport = require('./Transports/FCMPush/PushTransport');
const VoiceTransport = require('./Transports/VoiceTransport');
const WebTransport = require('./Transports/FCMPush/WebTransport');
const SMSTransport = require('./Transports/TwilioSMS/SMSTransport');

const EJSTemplate = require('./Templates/EJSTemplate');

const Worker = require('./Tasker/Worker');
const logger = require('./logger');
const config = require('../config');
const constants = require('../constants');

const Templates = {
  ejs: EJSTemplate,
};

const Transports = {
  email: new EmailTransport(config),
  push: new PushTransport(config),
  voice: new VoiceTransport(config),
  web: new WebTransport(config),
  sms: new SMSTransport(config),
};

class MyWorker extends Worker {
  constructor() {
    super();

    // Use a raw pooled connection because we will be using QueryStream
    const pool = new pg.Pool(config.db);

    pool.connect((err, client, done) => {
      if (err) {
        console.error(err);
        process.exit();
      }

      this.client = client;
      this.done = done;
    });
  }

  ready() {
    //Waits until the DB connection is ready.
    const check = resolve => {
      if (this.client) {
        resolve();
        return;
      }

      setTimeout(() => check(resolve), 100);
    };

    return new Promise(resolve => check(resolve));
  }

  async processData({ notification }) {
    // Output to the console so we know some work is being done.
    logger.info('[Worker]', worker.whoAmI, 'got data', notification);

    // Load the template for this notification.
    const template = new Templates['ejs'](notification.template_id);

    const deliveryMethods = notification.by.replace(/({|})/g, '').split(',');

    for (let delivery of deliveryMethods) {
      try {
        template.render({
          delivery,
          user: constants.good_user,
          data: notification.data,
        });
      } catch (error) {
        console.log('Failed to compile template with good user for delivery -', delivery);
        console.log(error);
        return;
      }
    }

    // Wait for the connection to be ready.
    await this.ready();

    // TODO: this is just a place holder until the below logic is implemented.
    //Get the users for this notification
    //Get all users in the notification.users field
    //Get all the users that belong to each group of the groups field
    //Filter out only users who have the tags in the tags field (if provided)

    // We will use a QueryStream for better memory performance.
    const stream = this.client.query(new QueryStream('SELECT * FROM account'));

    //Wait for the stream to be readable.
    await new Promise(resolve => stream.on('readable', resolve));

    let user;

    // Read the stream row by row.
    while (null !== (user = stream.read())) {
      for (let delivery of deliveryMethods) {
        //If the user wants this kind of notification.
        if (user.delivery.includes(delivery)) {
          let message, receipt;

          try {
            //Use the template to render the notification.
            message = await template.render({
              delivery,
              user,
              data: notification.data,
            });
          } catch (err) {
            // TODO: do something better on error.
            console.error(`Template generation failed - render${delivery}`);
            console.error('user', user);
            console.error('data', data);
            console.error(err);
            continue;
          }

          try {
            receipt = await Transports[delivery].send({ user, message });
          } catch (err) {
            // TODO: do something better on error.
            console.error(`Transport failed - ${delivery}`);
            console.error('user', user);
            console.error('message', message);
            console.error(err);
            continue;
          }
        }
      }
    }
  }
}

const worker = new MyWorker();
