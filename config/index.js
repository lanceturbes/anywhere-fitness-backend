require("dotenv").config()

module.exports = {
  PORT: process.env.PORT || 9000,
  HOST: process.env.HOST || "localhost",
  DATABASE_NAME: process.env.DATABASE_NAME || "anywherefitness-bwft5",
  PG_PORT: process.env.PG_PORT || 5432,
  PG_USERNAME: process.env.PG_USERNAME || "no username set",
  PG_PASSWORD: process.env.PG_PASSWORD || "no password set",
  NODE_ENV: process.env.NODE_ENV || "development"
}
