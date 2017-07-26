const pgPromise = require('pg-promise');
const dbConfig = require('../../config.json')['env:global'].dbConnection;

const pgp = pgPromise({
  // global event notification;
  error: function(error, e) {
    if (e.cn) {
      // A connection-related error;
      //
      // Connections are reported back with the password hashed,
      // for safe errors logging, without exposing passwords.
      console.error('[Error] Database connection:');
      console.error('Connection details:', e.cn);
      console.error('Error EVENT:', error.message || error);
    }
  }
});

// Parse float numbers instead of leaving them as text
pgp.pg.types.setTypeParser(1700, 'text', parseFloat);

// parse all integers, dangerous if numbers are bigger than in js
pgp.pg.types.setTypeParser(20, function(val) {
  return parseInt(val);
});

const db = pgp(dbConfig);

module.exports = db;
