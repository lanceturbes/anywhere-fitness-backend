const testClasses = [
  {
    attendees: 47,
    category_id: 5,
    class_name: "Castle Black Combat",
    duration: 120,
    instructor_id: 2,
    intensity: 3,
    location: "The Wall",
    max_class_size: 64,
    start_time: "06:00:00"
  },
  {
    attendees: 16,
    category_id: 2,
    class_name: "Pooch's Run",
    duration: 40,
    instructor_id: 1,
    intensity: 2,
    location: "Koopa Troopa Beach",
    max_class_size: 32,
    start_time: "10:00:00"
  }
]

function seed(knex) {
  return knex("classes").insert(testClasses)
}

module.exports = { seed, testClasses }
