const command = require('../../lib/command');

module.exports = port => {
  const partialUri = `localhost:${port}/api/webhook`;
  return {
    addWebHook: async ({ webhook }) => {
      return await command({ uri: partialUri, body: webhook, method: 'POST' });
    },
    removeWebHook: async ({ url }) => {
      return await command({ uri: `${partialUri}/${url}`, method: 'DELETE' });
    },
    getWebHook: async ({ url }) => {
      return await command({ uri: `${partialUri}/${url}`, method: 'GET' });
    },
    getAllWebHooks: async ({ url }) => {
      return await command({ uri: partialUri, method: 'GET' });
    },
    updateWebHook: async ({ url, update }) => {
      return await command({ uri: `${partialUri}/${url}`, body: update, method: 'PUT' });
    },
  };
};
