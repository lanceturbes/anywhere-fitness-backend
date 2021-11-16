const intensities = [
  { intensity_level: "low" },
  { intensity_level: "medium" },
  { intensity_level: "high" }
]

function seed(knex) {
  return knex("intensities").insert(intensities)
}

module.exports = { seed }
