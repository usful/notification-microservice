const path = require('path');
const fetch = require('node-fetch');
const squel = require('squel').useFlavour('postgres');
const pgp = require('pg-promise');

const config = require('../config');
const db = require('../database/client');
const Controller = require('../classes/Controller');
const queries = require('../server/notification/queries');

const TransactionMode = pgp.txMode.TransactionMode;
const isolationLevel = pgp.txMode.isolationLevel;

const controller = new Controller({
  script: path.resolve(__dirname, './NotificationWorker.js')
});

controller.setup();

//Sets transaction mode to read/write
const transactionMode = new TransactionMode({
  tiLevel: isolationLevel.serializable,
  readOnly: false
});

const getNextNotificationQuery = squel
  .select()
  .from('notification')
  .where('notification.at <= NOW()')
  .where("notification.status = 'new'")
  .order('notification.at')
  .limit(1)
  .toString();

//gets the next notification and marks it as processing
const transaction = async t => {
  try {
    const notification = await t.oneOrNone(getNextNotificationQuery);
    if (!!notification) {
      queries.updateNotification({
        id: notification.id,
        status: 'processing'
      });
    }
    return notification;
  } catch (error) {
    console.log(error);
  }
};

transaction.txMode = transactionMode;

controller.run({
  getData: async () => {
    while (true) {
      const notification = await db.tx(transaction);

      if (!!notification) {
        return { notification };
      }

      await new Promise(resolve =>
        setTimeout(resolve, config.engine.controllerCheckInterval)
      );
    }
  }
});
