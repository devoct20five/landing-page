// sequelize-cli's own config file. Intentionally plain CommonJS (not .ts):
// sequelize-cli loads config.* via a dynamic import() (see
// node_modules/sequelize-cli/lib/helpers/import-helper.js), which goes
// through Node's native ESM loader rather than ts-node's CommonJS require
// hook — a .ts file there gets executed as an ES module (no __dirname,
// different resolution) even though .ts migration/seeder files load fine
// through the ordinary require() path the migrator uses. Keeping this one
// file plain JS avoids that mismatch entirely.
//
// This mirrors src/database/database.config.ts's defaults; if you add a
// new DB_* env var, update both files.

const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

const base = {
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'oct20five',
  seederStorage: 'sequelize',
  seederStorageTableName: 'sequelize_seeds',
};

module.exports = {
  development: base,
  test: {
    ...base,
    database: process.env.DB_NAME_TEST || `${base.database}_test`,
  },
  production: {
    ...base,
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
};
