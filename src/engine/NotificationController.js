const path = require('path');
const fetch = require('node-fetch');
const squel = require('squel').useFlavour('postgres');
const pgp = require('pg-promise');
const db = require('../database/client');
const Controller = require('../classes/Controller');
const queries = require('../server/notification/queries');

const TransactionMode = pgp.txMode.TransactionMode;
const isolationLevel = pgp.txMode.isolationLevel;

const SLEEP_TIME = 1000;

const controller = new Controller({
  script: path.resolve(__dirname, './notificationWorker.js')
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
    try {
      while (true) {
        let notification = await db.tx(transaction);
        if (!!notification) {
          return { notification };
        }
        await new Promise(resolve => setTimeout(resolve, SLEEP_TIME));
      }
    } catch (err) {
      console.log('error', err);
    }
  }
});
