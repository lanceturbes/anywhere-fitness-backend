require("dotenv").config()

module.exports = {
  PORT: process.env.PORT || 9000,
  HOST: process.env.HOST || "localhost",
  DATABASE_MAIN: process.env.DATABASE_MAIN || "anywherefitness-bwft5",
  DATABASE_TESTING: process.env.DATABASE_TESTING || "anywherefitness-bwft5-testing",
  PG_PORT: process.env.PG_PORT || 5432,
  PG_USERNAME: process.env.PG_USERNAME || "no username set",
  PG_PASSWORD: process.env.PG_PASSWORD || "no password set",
  NODE_ENV: process.env.NODE_ENV || "development",
  JWT_SECRET: process.env.JWT_SECRET || "keep it secret; keep it safe!",
  BCRYPT_ROUNDS: process.env.BCRYPT_ROUNDS || 6
}
