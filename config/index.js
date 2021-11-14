require("dotenv").config()

module.exports = {
  PORT: process.env.PORT || 9000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: process.env.DATABASE_URL,
  DATABASE_URL_DEV: process.env.DATABASE_URL_DEV || "no development database url set",
  DATABASE_URL_TESTING: process.env.DATABASE_URL_TESTING || "no testing database url set",
  JWT_SECRET: process.env.JWT_SECRET || "keep it secret; keep it safe!",
  BCRYPT_ROUNDS: process.env.BCRYPT_ROUNDS || 6
}
