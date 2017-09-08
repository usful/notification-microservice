const { Writable } = require('stream');
const QueryStream = require('pg-query-stream');

const Worker = require('./Tasker/Worker');
const logger = require('./logger');

const config = require('../config');
const constants = require('../constants');
const util = require('../lib/util');

const dbClient = require('../database/poolClient');

const EmailTransport = require('../Transports/AwsEmail/AwsEmailTransport');
const PushTransport = require('../Transports/FCMPush/PushTransport');
const VoiceTransport = require('../Transports/VoiceTransport');
const WebTransport = require('../Transports/FCMPush/WebTransport');
const SMSTransport = require('../Transports/TwilioSMS/SMSTransport');

const EJSTemplate = require('../Templates/EJSTemplate');

const Webhooks = require('../Webhooks');

const Templates = {
  ejs: EJSTemplate,
};

const Transports = {
  email: new EmailTransport(config),
  push: new PushTransport(config),
  voice: new VoiceTransport(config),
  web: new WebTransport(config),
  sms: new SMSTransport(config)
};

class MyWorker extends Worker {
  constructor() {
    super();
    dbClient.connect(config.db);
    this.webhooks = new Webhooks(dbClient.db);
  }

  async processData({ notification }) {
    // Output to the console so we know some work is being done.
    logger.info('[Worker]', worker.whoAmI, 'got data', notification);

    // Load the template for this notification.
    const Template = Templates['ejs'];
    const template = new Template(notification.template_id, dbClient);
    await template.load(); // TODO: Handle not found error as hard error

    // Get the users for this notification
    // Get all users in the notification.users
    // Get all the users that belong to each group of the groups field
    // Filter out only users who have the tags in the tags field (if provided)
    const usersQs = new QueryStream(
      `
      SELECT acc.* FROM account acc
      LEFT JOIN account_groups a_g
        ON acc.id = a_g.user_id
      LEFT JOIN account_tags a_t
        ON acc.id = a_t.user_id
      WHERE
        acc.external_id = ANY($1::text[])
        OR
        a_g.group_name = ANY($2::text[])
        OR
        (cardinality($1::text[]) = 0 AND cardinality($2::text[]) = 0)
      GROUP BY acc.id
        HAVING
          ((array_agg(a_t.tag_name::text) && ($3::text[])) OR cardinality($3::text[]) = 0)
      `,
      [util.pgArr(notification.users), util.pgArr(notification.groups), util.pgArr(notification.tags)]
    );

    const consumerStream = new Writable({
      objectMode: true,
      write: async(user, encoding, callback) => {
        logger.info('Sending message to user', user.name);

        const messages = [];
        for (let transportName of notification.by) {
          let message;
          try {
            logger.info('rendering message', { transportName, user, data: notification.data });
            message = await template.render({ transportName, user, data: notification.data });
          } catch (error) {
            // TODO: handle error as hard error
            logger.info('[Worker] failed to compile template with good user for transport -', transportName);
            logger.info(error);
            callback(error);
          }

          try {
            await Transports[transportName].send({ user, message});
            //todo firing UserDeliverySuccess for cases where the transport is immediate? perhaps make transports event emitters
          }catch (error){
            logger.info('[Worker] failed to send message to user -', user);
            logger.info(error);
            /**
             * If an implemented transport never sends back a failed immediately firing the webhook should
             * be implemented in a seperate file. Example is AWS email
             */
            this.webhooks.fire('UserDeliveryFailed', user);
          }
        }

        callback();
      },
    });

    let res;
    try {
      await dbClient.db.stream(usersQs, s => s.pipe(consumerStream));
      await new Promise(resolve => consumerStream.on('finish', resolve));
      logger.info('[Worker] successfully sent notification');
      this.webhooks.fire('NotificationSuccess', notification);
    } catch (error) {
      logger.error('[Worker] failed sending notification');
      this.webhooks.fire('NotificationFailed', notification);
      throw error;
    }
  }
}

const worker = new MyWorker();
