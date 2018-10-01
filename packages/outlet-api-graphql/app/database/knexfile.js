// import '@config/init';
import path from 'path';
import yn from 'yn';
import { knexSnakeCaseMappers } from 'objection';

console.log(process.cwd());

const { DB_DRIVER, DB_NAME, DB_HOST, DB_USER, DB_PASS, USER } = process.env;

module.exports = {
  debug: yn(process.env.DEBUG),
  client: DB_DRIVER || 'postgresql',
  connection: {
    database: DB_NAME,
    host: DB_HOST || 'localhost',
    user: DB_USER || USER || 'postgres',
    password: DB_PASS
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: path.join(__dirname, 'migrations')
  },
  seeds: {
    directory: path.join(__dirname, 'seeds')
  },
  ...knexSnakeCaseMappers()
};
