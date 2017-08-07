const { API } = require('../../src');

/** Userland **/

const api = new API(config);

await api.start();

// api.stop();
