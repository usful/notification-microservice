const cp = require('child_process');
const NUM_CPU = require('os').cpus().length;
const config = require('../config');

module.exports = class Controller {
  constructor({ maxWorkers = NUM_CPU, script }) {
    this.workers = [];
    this.maxWorkers = maxWorkers;
    this.script = script;
  }

  restartWorker(worker) {
    const id = worker.whoAmI;
    clearInterval(worker.pingInterval);

    worker.kill();

    this.workers[id] = this.createWorker(id);
  }

  createWorker(id) {
    const worker = cp.fork(this.script);

    worker.on('message', function(message) {
      switch (message.command) {
        case 'register':
          console.log('Controller', 'Worker', this.whoAmI, 'registered');
          break;
        case 'available':
          this.available = true;
          break;
        case 'done':
          this.available = true;
          clearTimeout(this.deadLockTimeout);
          break;
        case 'failed':
          this.available = true;
          clearTimeout(this.deadLockTimeout);
          break;
        case 'ping':
          this.crashed = false;
          break;
      }
    });

    worker.on('close', function(code, signal) {
      this.available = false;
      console.log('Controller', 'Worker', this.whoAmI, 'closed');
    });

    worker.on('exit', function(code, signal) {
      this.available = false;
      console.log('Controller', 'Worker', this.whoAmI, 'exited');
    });

    worker.whoAmI = id;

    //Let the worker know which ID it is.
    worker.send({ command: 'register', whoAmI: id });

    //We will track who is busy and who is not with this flag.
    worker.available = false;
    worker.crashed = false;

    worker.pingInterval = setInterval(() => {
      if (worker.crashed) {
        this.restartWorker(worker);
      } else {
        worker.crashed = true;
        worker.send({ command: 'ping' });
      }
    }, config.engine.workerPingInterval);

    return worker;
  }

  setup() {
    //Launch a worker per CPU.
    for (let i = 0; i < this.maxWorkers; i++) {
      this.workers.push(this.createWorker(i));
    }
  }

  /**
   * Wait's for a worker to become available and then returns that worker.
   * @returns {Promise}
   */
  getNextAvailableWorker() {
    const check = resolve => {
      for (let i = 0; i < this.workers.length; i++) {
        const worker = this.workers[i];

        if (worker.available) {
          worker.available = false;
          resolve(worker);
          return;
        }
      }

      setTimeout(() => check(resolve), config.engine.loadBalancerInterval);
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

      worker.deadLockTimeout = setTimeout(
        () => this.restartWorker(worker),
        config.engine.deadlockTimeout
      );

      worker.send({
        command: 'data',
        data: data
      });
    }
  }
};
