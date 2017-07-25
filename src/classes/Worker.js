/**
 * A class that can be extended to create a worker process.
 */
class Worker {
	constructor() {
		this.whoAmI = -1;

		process.on('message', async message => {
			switch (message.command) {
				case 'register':
					this.whoAmI = message.whoAmI;
					process.send({ command: 'register', whoAmI: this.whoAmI });
					break;
				case 'data':
					try {
						await this.processData(message.data);
						process.send({ command: 'done' });
					} catch (err) {
						process.send({ command: 'failed' });

						console.error(err);
						console.error(err.stack);
					}
					break;
				case 'ping':
					console.log('Controller pinged Worker', this.whoAmI);
					process.send({ command: 'ping' });
					break;
			}
		});

		process.send({ command: 'available' });
	}

	/**
   * Overridable async function that performs the work
   * @param data
   * @returns {Promise.<boolean>}
   */
	async processData({ data }) {
		return true;
	}
}

/**
 * The Worker Class
 * @type {Worker}
 */
module.exports = Worker;
