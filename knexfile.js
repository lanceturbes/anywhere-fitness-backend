const pg = require("pg")

const {
  DATABASE_URL,
  DATABASE_URL_DEV,
  DATABASE_URL_TESTING
} = require("./config")

if (DATABASE_URL) {
  pg.defaults.ssl = { rejectUnauthorized: false }
}

const sharedConfig = {
  client: "pg",
  useNullAsDefault: true,
  migrations: { directory: "./data/migrations" },
  seeds: { directory: "./data/seeds" }
}

module.exports = {
  development: {
    ...sharedConfig,
    connection: DATABASE_URL_DEV
  },
  testing: {
    ...sharedConfig,
    connection: DATABASE_URL_TESTING
  },
  production: {
    ...sharedConfig,
    connection: DATABASE_URL,
    pool: { min: 2, max: 10 },
  }
}
