const path = require('path');
const fetch = require('node-fetch');
const Controller = require('../classes/Controller');

//Create our controller, passing in the script we want to run
//in the worker proccesses.
const controller = new Controller({
  script: path.resolve(__dirname, './notificationWorker.js')
});

controller.setup();
controller.run({
  getData: async () => {
    //Fetch next notification from notification queue
    return {};
  }
});
