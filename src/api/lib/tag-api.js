const command = require('../../lib/command');

module.exports = port => {
  const partialUri = `http://localhost:${port}/api/tag`;
  return {
    addTagToUser: async ({ userId, tag }) => {
      return await command({ uri: `${partialUri}/${userId}/${tag}`, method: 'POST' });
    },
    getTag: async ({ tag }) => {
      return await command({ uri: `${partialUri}/${tag}`, method: 'GET' });
    },
    removeTagFromUser: async ({ userId, tag }) => {
      return await command({ uri: `${partialUri}/${userId}/${tag}`, method: 'DELETE' });
    },
  };
};
