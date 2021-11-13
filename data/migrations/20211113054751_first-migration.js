const up = async (knex) => {
  await knex.schema
    .createTable("users", table => {
      table.increments("user_id")
        .primary()
      table.string("username", 128)
        .notNullable()
        .unique()
    })
}

const down = async (knex) => {
  await knex.schema
    .dropTableIfExists("users")
}

module.exports = { up, down }
