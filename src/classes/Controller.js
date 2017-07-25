const cp = require('child_process');
const NUM_CPU = require('os').cpus().length;
const THROTTLE = 20; //ms;
const DEADLOCK_THROTTLE = 1800000; //30 minutes default
const CHECK_THROTTLE = 1000;

module.exports = class Controller {
	constructor({ maxWorkers = NUM_CPU, script }) {
		this.workers = [];
		this.maxWorkers = maxWorkers;
		this.script = script;
		this.timers = [];
	}

	restartWorker(worker) {
	  clearInterval(this.timers[worker.whoAmI]);
		worker.kill();
		const newWorker = this.createWorker(worker.whoAmI);
		this.workers[worker.whoAmI] = newWorker;
	}

	createWorker(id) {
		const worker = cp.fork(this.script);

		console.log('Controller', 'Worker', id, 'created');

		worker.on('message', function(message) {
			switch (message.command) {
				case 'register':
					console.log('Controller', 'Worker', this.whoAmI, 'registered');
					break;
				case 'available':
					console.log('Controller', 'Worker', this.whoAmI, 'available');
					this.available = true;
					break;
				case 'done':
					console.log('Controller', 'Worker', this.whoAmI, 'done');
					this.available = true;
					clearTimeout(this.deadLockTimeout);
					break;
				case 'failed':
					console.log('Controller', 'Worker', this.whoAmI, 'failed');
					this.available = true;
					clearTimeout(this.deadLockTimeout);
					break;
				case 'ping':
					console.log('Worker', this.whoAmI, 'pinged Controller');
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
    this.timers.push(setInterval(this.crashCheckGen(worker), CHECK_THROTTLE));
		return worker;
	}

	crashCheckGen(worker) {
		return () => {
		  if (worker.crashed) {
		    this.restartWorker(worker);
      }else {
		    worker.crashed = true;
		    worker.send({ command: 'ping'});
      }
    }
	}

	setup() {
		//Launch a worker per CPU
		for (let i = 0; i < this.maxWorkers; i++) {
			const worker = this.createWorker(i);
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
			worker.deadLockTimeout = setTimeout(() => {
				this.restartWorker(worker);
			}, DEADLOCK_THROTTLE);
			worker.send({
				command: 'data',
				data: data,
			});
		}
	}
};
