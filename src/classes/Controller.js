const cp = require('child_process');
const NUM_CPU = require('os').cpus().length;
const THROTTLE = 20; //ms;

module.exports = class Controller {
  constructor({ maxWorkers = NUM_CPU, script }) {
    this.workers = [];
    this.maxWorkers = maxWorkers;
    this.script = script;
  }

  setup() {
    //Launch a worker per CPU
    for (let i = 0; i < this.maxWorkers; i++) {
      const worker = cp.fork(this.script);

      console.log('Controller', 'Worker', i, 'created');

      worker.on('message', function(message) {
        switch (message.command) {
          case 'register':
            console.log('Controller', 'Worker', worker.whoAmI, 'registered');
            break;
          case 'available':
            console.log('Controller', 'Worker', worker.whoAmI, 'available');
            this.available = true;
            break;
          case 'done':
            console.log('Controller', 'Worker', worker.whoAmI, 'done');
            this.available = true;
            break;
          case 'failed':
            console.log('Controller', 'Worker', worker.whoAmI, 'failed');
            this.available = true;
            break;
        }
      });

      worker.on('close', function(code, signal) {
        this.available = false;
        console.log('Controller', 'Worker', worker.whoAmI, 'closed');
      });

      worker.on('exit', function(code, signal) {
        this.available = false;
        console.log('Controller', 'Worker', worker.whoAmI, 'exited');
      });

      worker.whoAmI = i;
      //Let the worker know which ID it is.
      worker.send({ command: 'register', whoAmI: i });

      //We will track who is busy and who is not with this flag.
      worker.available = false;
      this.workers.push(worker);
    }
  }

  /**
   * Wait's for a worker to become available and then returns that worker.
   * @returns {Promise}
   */
  getNextAvailableWorker() {
    const check = resolve => {
      for (let worker of this.workers) {
        if (worker.available) {
          worker.available = false;
          resolve(worker);
          return;
        }
      }

      setTimeout(() => check(resolve), THROTTLE);
    };

    return new Promise(resolve => check(resolve));
  }

  /**
   * Runs this controller. Requires an async function called getData to be passed in.  This function
   * gets the next set of data to be processed and passes it to a worker process.
   * @param getData
   * @returns {Promise.<void>}
   */
  async run({ getData }) {
    let data;

    while ((data = await getData())) {
      let worker = await this.getNextAvailableWorker();

      worker.send({
        command: 'data',
        data: data
      });
    }
  }
};
