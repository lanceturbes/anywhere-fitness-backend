const {
  PG_PORT,
  HOST,
  DATABASE_NAME,
  PG_USERNAME,
  PG_PASSWORD
} = require("./config")

module.exports = {
  development: {
    client: "postgresql",
    connection: {
      port: PG_PORT,
      host: HOST,
      database: DATABASE_NAME,
      user: PG_USERNAME,
      password: PG_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: "./data/migrations",
      tableName: "knex_migrations"
    },
    seeds: {
      directory: "./data/seeds"
    }
  },
}
