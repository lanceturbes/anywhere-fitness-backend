async function up(knex) {
  return await knex.schema
    .createTable("categories", table => {
      table.increments("category_id")
        .primary()
      table.string("category_name")
        .notNullable()
        .unique()
    })

    .createTable("intensities", table => {
      table.increments("intensity_id")
        .primary()
      table.string("intensity_level")
        .notNullable()
        .unique()
    })

    .createTable("classes", table => {
      table.increments("class_id")
        .primary()
      table.string("class_name")
        .notNullable()
        .unique()
      table.string("location")
        .notNullable()
      table.integer("duration")
        .defaultTo(60)
      table.integer("max_class_size")
        .defaultTo(30)
      table.time("start_time")
        .notNullable()

      // Foreign Keys
      table.integer("instructor_id")
        .notNullable()
      table.foreign("instructor_id")
        .references("user_id")
        .on("users")

      table.integer("category_id")
        .notNullable()
      table.foreign("category_id")
        .references("category_id")
        .on("categories")

      table.integer("intensity")
        .notNullable()
      table.foreign("intensity")
        .references("intensity_id")
        .on("intensities")
    })
}

async function down(knex) {
  return await knex.schema
    .dropTableIfExists("classes")
    .dropTableIfExists("intensities")
    .dropTableIfExists("categories")
}

module.exports = { up, down }
