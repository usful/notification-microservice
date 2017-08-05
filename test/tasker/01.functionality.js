const path = require('path');
const Controller = require('./TestController');

const tasks = ['one', 'two', 'three', 'four', 'five'];
let doneCounter = 0;
let taskLength = tasks.length;

async function getData(controller) {
  while (controller.live) {
    const name = tasks.shift();

    if (name) {
      return { name };
    }

    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

/** Boot the TestController and run it **/
const controller = new Controller({
  maxWorkers: 2,
});
controller.setup();
controller.on('done', () => {
  doneCounter++;
  console.log('[functionality] task done!', doneCounter, ' of ', taskLength);
  if (doneCounter >= taskLength) {
    console.log('[functionality] Killing controller');
    controller.kill();
  }
});

controller.run({ getData })
  .then(() => {
    console.log('VALIDATE STUFF');
  })
  .catch((error) => console.log('[Error] running controller', error));
