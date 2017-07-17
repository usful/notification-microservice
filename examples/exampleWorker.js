const Worker = require('../src/classes/Worker');

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
const pause = () => new Promise(resolve => setTimeout(() => resolve(), getRandomInt(1000,10000)));

//Extend the Worker class.
class MyWorker extends Worker {
  /**
   * Implement the processData async function.  This function would do any arbitrary amount of work required.
   * IE. this could receive a notification as data, and then do all the work required to send that notification.
   */
  async processData({ user, counter }) {
    //Output to the console so we know some work is being done.
    console.log('Worker', worker.whoAmI, 'got data', counter);

    //Fake doing some work on the data.
    await pause();

    //Return a result.
    return {
      result: this.whoAmI
    };
  }
}

const worker = new MyWorker();
