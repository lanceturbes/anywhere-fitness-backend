exports.up = function (knex) {
  return knex.schema
    .createTable("roles", table => {
      table.increments("role_id")
        .primary()
      table.string("role_name")
        .notNullable()
        .unique()
    })
    .table("users", table => {
      table.integer("role_id")
        .defaultTo(1)
      table.foreign("role_id")
        .references("role_id")
        .on("roles")
        .onDelete("SET NULL")
    })
}

exports.down = function (knex) {
  return knex.schema
    .table("users", table => {
      table.dropColumn("role_id")
    })
    .dropTableIfExists("roles")
}
