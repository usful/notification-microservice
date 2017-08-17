const pgPromise = require('pg-promise');

class PoolClient {
  constructor() {
    this.pgp = null;
    this.database = null;
  }

  connect(dbConfig) {
    this.dbConfig = dbConfig;

    this.pgp = pgPromise({
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
    this.pgp.pg.types.setTypeParser(1700, 'text', parseFloat);

    // parse all integers, dangerous if numbers are bigger than in js
    this.pgp.pg.types.setTypeParser(20, function(val) {
      return parseInt(val);
    });

    console.log('[dbClient] connecting to db', this.dbConfig.host, this.dbConfig.port, this.dbConfig.database);
    this.database = this.pgp(this.dbConfig);

    this.addCustomParsers().catch(error => {
      console.error('[poolClient] error adding custom parsers! please check consistency with database!');
      throw error;
    });
  }

  // Custom parsing for enums
  async addCustomParsers() {
    const enums = await this.db.many(
      `
      SELECT typname, oid, typarray
      FROM pg_type
      WHERE
      (
        typname = 'verification_status' OR
        typname = 'delivery_type' OR
        typname = 'notification_status'
      ) AND
      typarray <> 0
      ORDER by oid
      `
    );
    enums.forEach(en => this.addArrayParser(en.typarray));
  }

  // Add parser to convert values to arrays on a custom oid type
  addArrayParser(oid) {
    const arrayParser = this.pgp.pg.types.arrayParser;
    this.pgp.pg.types.setTypeParser(oid, val => {
      return arrayParser.create(val, String).parse();
    });
  }

  get db() {
    if (this.database) {
      return this.database;
    }
    throw new Error('[poolClient Error] should connect before getting the db object');
  }

  end() {
    console.log('[dbClient dissconnection from db]');
    this.pgp.end();
    this.pgp = null;
    this.database = null;
  }
}

module.exports = new PoolClient();
