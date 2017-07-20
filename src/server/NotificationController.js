const path = require("path");
const fetch = require("node-fetch");
const squel = require("squel").useFlavour("postgres");
const db = require("../../database/client");
const Controller = require("../classes/Controller");

const controller = new Controller({
  script: path.resolve(__dirname, "./notificationWorker.js")
});

controller.setup();
controller.run({
  getData: async () => {
    var selectQuery = squel
      .select()
      .from("notification")
      .where("notification.sent is NULL")
      .where("notification.at <= NOW()")
      .order("notification.at");
    try {
      const notification = (await db.manyOrNone(selectQuery.toString()))[0];
      return {notification};
    } catch (err) {
      console.log("error", err);
    }

    return {};
  }
});
