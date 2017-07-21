const path = require("path");
const fetch = require("node-fetch");
const squel = require("squel").useFlavour("postgres");
const pgp = require("pg-promise");
const db = require("../../database/client");
const Controller = require("../classes/Controller");

const TransactionMode = pgp.txMode.TransactionMode;
const isolationLevel = pgp.txMode.isolationLevel;

const SLEEP_TIME = 1000;

const controller = new Controller({
  script: path.resolve(__dirname, "./notificationWorker.js")
});

controller.setup();

//Sets transaction mode to read/write
const transactionMode = new TransactionMode({
  tiLevel: isolationLevel.serializable,
  readOnly: false
});

//need to include something so that notifications that are being worked on aren't taken
const selectQuery = squel
  .select()
  .from("notification")
  .where("notification.sent is NULL")
  .where("notification.at <= NOW()")
  .where("notification.status != 'inProgress'")
  .order("notification.at")
  .limit(1);

const updateQueryGen = id =>
  squel
    .update()
    .table("notification")
    .set("status", "inProgress")
    .where("id = ?", id);

//gets the next notification and marks it as inProgress
const transaction = t => {
  return t
    .one(selectQuery.toString())
    .then(notification => {
      t.none(updateQueryGen(notification.id).toString());
      return notification;
    })
    .catch(error => {
      //no notification got
      //console.log('error',error);
    });
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
      console.log("error", err);
    }
  }
});
