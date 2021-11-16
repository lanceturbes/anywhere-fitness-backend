const categories = [
  { category_name: "balance" },
  { category_name: "endurance" },
  { category_name: "flexibility" },
  { category_name: "meditation" },
  { category_name: "strength" },
]

function seed(knex) {
  return knex("categories").insert(categories)
}

module.exports = { seed }
