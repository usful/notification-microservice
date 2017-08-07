const Worker = require('../../src/engine/Tasker/Worker');

const tasks = ['one', 'two', 'three', 'four', 'five'];

/** Extends Worker and tell it how to process Data **/
class TestWorker extends Worker {
  async processData(data) {
    console.log('[Test Worker] processed data', data.name);
  }
}

module.exports = new TestWorker();
