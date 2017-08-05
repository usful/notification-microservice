const logger = require('../logger');

/**
 * A class that can be extended to create a worker process.
 */
class Worker {
	constructor() {
		this.whoAmI = -1;
    // logger.info('[Worker] just born');
		process.on('message', async message => {
			switch (message.command) {
				case 'register':
					this.whoAmI = message.whoAmI;
          // logger.info(`[Worker ${this.whoAmI}] got id`);
					process.send({ command: 'register', whoAmI: this.whoAmI });
					break;
				case 'data':
					try {
						await this.processData(message.data);
						process.send({ command: 'done' });
					} catch (error) {
						process.send({ command: 'failed' });
            // logger.error(error);
					}
					break;
				case 'ping':
					process.send({ command: 'ping' });
					break;
			}
		});

    // logger.info(`[Worker] regisering to work`);
		process.send({ command: 'available' });
	}

	/**
   * Overridable async function that performs the work
   * @param data
   * @returns {Promise.<boolean>}
   */
	async processData({ data }) {
		throw new Error('Please override processData function in Worker Class');
	}
}

/**
 * The Worker Class
 * @type {Worker}
 */
module.exports = Worker;
