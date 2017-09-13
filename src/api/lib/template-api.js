const command = require('../../lib/command');

module.exports = port => {
  const partialUri = `http://localhost:${port}/api/template`;
  return {
    createTemplate: async ({ template }) => {
      return await command({ uri: partialUri, body: template, method: 'POST' });
    },
    updateTemplate: async ({ templateId, template }) => {
      return await command({ uri: `${partialUri}/${templateId}`, body: template, method: 'PUT' });
    },
    removeTemplate: async ({ templateId }) => {
      return await command({ uri: `${partialUri}/${templateId}`, method: 'DELETE' });
    },
    getTemplate: async ({ templateId }) => {
      return await command({ uri: `${partialUri}/${templateid}`, method: 'GET' });
    },
  };
};
