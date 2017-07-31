const pgPromise = require('pg-promise');

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
  },
});

// Parse float numbers instead of leaving them as text
pgp.pg.types.setTypeParser(1700, 'text', parseFloat);

// parse all integers, dangerous if numbers are bigger than in js
pgp.pg.types.setTypeParser(20, function(val) {
  return parseInt(val);
});


let databaseObj = null;
const client = { pgp };

function getDb() {
  if (databaseObj) {
    return databaseObj;
  }
  throw new Error('[poolClient Error] should connect before getting the db object');
}
client.db = getDb;

function connect(dbConfig) {
  console.log('[dbClient] connecting to db', dbConfig.host, dbConfig.port);
  databaseObj = pgp(dbConfig);
}
client.connect = connect;

module.exports = client;
