const pg = require('pg');
const QueryStream = require('pg-query-stream');

const EmailTransport = require('./transport/EmailTransport');
const PushTransport = require('./transport/PushTransport');
const VoiceTransport = require('./transport/VoiceTransport');
const WebTransport = require('./transport/WebTransport');
const SMSTransport =  require('./transport/SMSTransport');

const config = require('../config');
const Worker = require('../classes/Worker');
const Template = require('../classes/Template');

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

    //Use a raw pooled connection because we will be using QueryStream
    const pool = new pg.Pool(config.dbConnection);

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
    //Output to the console so we know some work is being done.
    console.log('Worker', worker.whoAmI, 'got data', notification);

    //Load the template for this notification.
    const template = new Template(notification.template_id);

    //Wait for the connection to be ready.
    await this.ready();

    // TODO: this is just a place holder until the below logic is implemented.
    //Get the users for this notification
    //Get all users in the notification.users field
    //Get all the users that belong to each group of the groups field
    //Filter out only users who have the tags in the tags field (if provided)

    //We will use a QueryStream for better memory performance.
    const stream = this.client.query(new QueryStream(`SELECT * FROM account`));

    //Wait for the stream to be readable.
    await new Promise(resolve => stream.on('readable', resolve));

    let user;

    //Read the stream row by row.
    while (null !== (user = stream.read())) {

      // TODO: replace with notification.by when implemented
      for (let delivery of ['email', 'sms']) {
        //If the user wants this kind of notification.
        if (user.delivery.includes(delivery)) {
          let message, receipt;

          try {
            //Use the template to render the notification.
            message = await template.render({ delivery, user, data: notification.data });
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
