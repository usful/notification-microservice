const path = require('path');
const fetch = require('node-fetch');
const Controller = require('../src/classes/Controller');

//Create our controller, passing in the script we want to run
//in the worker proccesses.
const controller = new Controller({
  script: path.resolve(__dirname, './exampleWorker.js')
});

let counter = 0;

controller.setup();
controller.run({
  getData: async () => {
    //Get some arbitrary data, this could have come from a database instead.
    const response = await fetch('https://api.github.com/users/github');
    const user = await response.json();

    //Increment a counter just to see what is happening.
    counter++;

    return {
      user,
      counter
    };
  }
});
