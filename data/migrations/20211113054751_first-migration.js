const up = async knex => {
  return await knex.schema
    .createTable("users", table => {
      table.increments("user_id")
        .primary()
      table.string("username", 32)
        .notNullable()
        .unique()
      table.string("password")
        .notNullable()
      table.string("email")
        .notNullable()
    })
}

const down = async knex => {
  return await knex.schema
    .dropTableIfExists("users")
}

module.exports = { up, down }
