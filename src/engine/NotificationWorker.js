const Worker = require('../classes/Worker');
const squel = require('squel').useFlavour('postgres');
const db = require('../database/client');

/**
 * Get a random integer.  Used to pause a random amount of time.
 * @param min
 * @param max
 * @returns {*}
 */
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

/**
 * Return a promise that will pause for a random amount of time, to simulate work being done.
 */
const pause = () => new Promise(resolve => setTimeout(() => resolve(), getRandomInt(1000, 10000)));

//Extend the Worker class.
class MyWorker extends Worker {
	/**
   * Implement the processData async function.  This function would do any arbitrary amount of work required.
   * IE. this could receive a notification as data, and then do all the work required to send that notification.
   */
	async processData({ notification }) {
		//Output to the console so we know some work is being done.
		console.log('Worker', worker.whoAmI, 'got data', notification);

		//Fake doing some work on the data.
		await pause();

		/**for now will reset the notification status back to 'waiting' to reuse them. Didn't want to have to infinitely
     * make notifications to test.**/
		const tempQuery = squel.update().table('notification').set('status', 'new').where('id = ?', notification.id);
		db.none(tempQuery.toString());
	}
}

const worker = new MyWorker();
