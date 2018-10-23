import '@config/init';
import path from 'path';
import { get } from 'lodash';
import { argv } from 'yargs';
import knexDbManager from 'knex-db-manager';

const knex = require(path.join(__dirname, 'knexfile'));
const db = knexDbManager.databaseManagerFactory({
  knex,
  dbManager: {
    superUser: knex.connection.user
  }
});

const dbName = get(knex, 'connection.database');

const { task } = argv;

switch (task) {
  case 'create':
    db
      .createDb(dbName)
      .then(() => {
        console.log('Database', dbName, 'created.');
        process.exit(0);
      })
      .catch((err) => {
        console.error(err);
        process.exit(1);
      });

    break;

  case 'drop':
    db
      .dropDb(dbName)
      .then(() => {
        console.log('Database', dbName, 'dropped.');
        process.exit(0);
      })
      .catch((err) => {
        console.error(err);
        process.exit(1);
      });

    break;
}
