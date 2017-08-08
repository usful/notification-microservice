const logger = require('../logger');

/**
 * A class that can be extended to create a worker process.
 */
class Worker {
	constructor() {
		this.whoAmI = -1;
    // logger.debug('[Worker] just born');
		process.on('message', async message => {
			switch (message.command) {
				case 'register':
					this.whoAmI = message.whoAmI;
          // logger.debug(`[Worker ${this.whoAmI}] got id`);
					process.send({ command: 'register', whoAmI: this.whoAmI });
					break;
				case 'data':
					try {
						await this.processData(message.data);
						process.send({ command: 'done', data: message.data });
					} catch (error) {
						process.send({ command: 'failed', data: message.data });
            // logger.error(error);
					}
					break;
				case 'ping':
					process.send({ command: 'ping' });
					break;
			}
		});

    // logger.debug(`[Worker] regisering to work`);
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
