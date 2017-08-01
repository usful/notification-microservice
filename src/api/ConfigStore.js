const _ = require('lodash');

const store = {
  config: {},
};

function update(newConfig) {
  _.merge(store.config, newConfig);
}

store.update = update;

module.exports = store;
