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
   * @param message
   * @returns {Promise.<void>}
   */
  async send({ user, message }) {
    console.log(this.constructor.name, 'sending', message, 'to', user.id);
  }
};
