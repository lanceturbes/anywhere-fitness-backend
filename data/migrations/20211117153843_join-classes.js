exports.up = function (knex) {
  return knex.schema
    .createTable("classes_clients", table => {
      table.increments("classes_clients_id")
        .primary()
      table.integer("class_id")
        .notNullable()
      table.integer("user_id")
        .notNullable()

      // Foreign Keys
      table.foreign("class_id")
        .references("class_id")
        .on("classes")
        .onDelete("CASCADE")
      table.foreign("user_id")
        .references("user_id")
        .on("users")
        .onDelete("CASCADE")
    })
}

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("classes_clients")
}
