/**
 * Interface for Transports.
 */
module.exports = class Transport {
  constructor(config) {
    this.config = config;
  }
  
  /**
   * Sends a message to the user.
   *
   * @param user
   * @param data
   * @returns {Promise.<void>}
   */
  async send({ user, data }) {
    console.log(this.constructor.name, 'sending', data, 'to', user.id);
  }
}