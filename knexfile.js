const {
  PG_PORT,
  HOST,
  DATABASE_MAIN,
  DATABASE_TESTING,
  PG_USERNAME,
  PG_PASSWORD
} = require("./config")

const sharedConfig = {
  client: "pg",
  useNullAsDefault: true,
  connection: {
    port: PG_PORT,
    host: HOST,
    user: PG_USERNAME,
    password: PG_PASSWORD
  },
  migrations: {
    directory: "./data/migrations",
    tableName: "knex_migrations"
  },
  seeds: {
    directory: "./data/seeds"
  }
}

module.exports = {
  development: {
    ...sharedConfig,
    connection: {
      ...sharedConfig.connection,
      database: DATABASE_MAIN
    }
  },
  testing: {
    ...sharedConfig,
    connection: {
      ...sharedConfig.connection,
      database: DATABASE_TESTING
    }
  },
  production: {
    ...sharedConfig
  }
}
