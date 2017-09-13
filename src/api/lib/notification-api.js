const command = require('../../lib/command');

module.exports = port => {
  const partialUri = `localhost:${port}/api/notification`;
  return {
    createNotification: async ({ notification }) => {
      return await command({ uri: partialUri, body: notification, method: 'POST' });
    },
    removeNotification: async ({ notificationId }) => {
      return await command({ uri: `${partialUri}/${notificationId}`, method: 'DELETE' });
    },
    updateNotification: async ({ notificationId, notification }) => {
      return await command({ uri: `${partialUri}/${notificationId}`, body: notification, method: 'PUT' });
    },
    getNotification: async ({ notificationId }) => {
      return await command({ uri: `${partialUri}/${notificationId}`, method: 'GET' });
    },
    getUserNotifications: async ({userId, limit = 10}) => {
      return await command({ uri: `${partialUri}/sent`, body: {userId, limit}, method:'GET'});
    }
  };
};
