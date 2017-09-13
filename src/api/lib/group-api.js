const command = require('../../lib/command');

module.exports = port => {
  const partialUri = `localhost:${port}/api/group`;
  return {
    addUserToGroup: async ({ userId, group }) => {
      return await command({ uri: `${partialUri}/${userId}/${group}`, method: 'POST' });
    },
    getGroup: async ({ group }) => {
      return await command({ uri: `${partialUri}/${group}`, method: 'GET' });
    },
    removeUserFromGroup: async ({ userId, group }) => {
      return await command({ uri: `${partialUri}/${userId}/${group}`, method: 'DELETE' });
    },
  };
};
