const { clean } = require("knex-cleaner")

function seed(knex) {
  return clean(knex, {
    mode: "truncate",
    ignoreTables: ['knex_migrations', 'knex_migrations_lock'],
  })
}

module.exports = seed
