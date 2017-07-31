const { Engine } = require('../../src');

const engine = new Engine({
  workers: 2,
  transports: {
    push: {
      name: '../../transports/push-fcm-transport', // file name or npm package
      // parser: // Mustache by default or custom parser function
    },
  },
});

// engine.on('failed', () => console.log('message failed sending'));

engine.run();

// engine.stop();
