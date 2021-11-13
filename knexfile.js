require("dotenv").config()

const PG_PORT = process.env.PG_PORT || 5432
const HOST = process.env.HOST || "localhost"
const DATABASE_NAME = process.env.DATABASE_NAME || "anywherefitness-bwft5"
const PG_USERNAME = process.env.PG_USERNAME
const PG_PASSWORD = process.env.PG_PASSWORD

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
