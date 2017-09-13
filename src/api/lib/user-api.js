const command = require('../../lib/command');

module.exports = port => {
  const partialUri = `localhost:${config.api.port}/api/user`;
  return {
    createUser: async ({user}) =>{
      return await command({ uri:partialUri, body: user, method: 'POST' });
    },
    updateUser: async ({ userId, update }) => {
      return await command({ uri: `${partialUri}/${userId}`, body: update, method: 'PUT' });
    },
    getUser: async ({ userId }) => {
      return await command({ uri: `${partialUri}/${userId}`, method: 'GET' });
    },
    deleteUser: async ({ userId }) => {
      return await command({ uri: `${partialUri}/${userId}`, method: 'DELETE' });
    },
  };
};