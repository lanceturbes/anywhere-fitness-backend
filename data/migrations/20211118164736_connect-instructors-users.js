exports.up = function (knex) {
  return knex.schema
    .createTable("classes_instructors", table => {
      table.increments("classes_instructors_id")
        .primary()
      table.integer("class_id")
        .notNullable()
      table.integer("instructor_id")
        .notNullable()

      // Foreign Keys
      table.foreign("class_id")
        .references("class_id")
        .on("classes")
        .onDelete("CASCADE")
      table.foreign("instructor_id")
        .references("user_id")
        .on("users")
        .onDelete("CASCADE")
    })
}

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("classes_instructors")
}
