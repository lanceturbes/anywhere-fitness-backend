const testClasses = [
  {
    attendees: 47,
    duration: 120,
    class_id: 1,
    instructor_id: 2,
    intensity: 3,
    location: "The Wall",
    max_class_size: 64,
    class_name: "Castle Black Combat",
    start_time: "06:00:00",
    category_id: 5
  },
  {
    attendees: 16,
    duration: 40,
    class_id: 2,
    instructor_id: 1,
    intensity: 2,
    location: "Koopa Troopa Beach",
    max_class_size: 32,
    class_name: "Pooch's Run",
    start_time: "10:00:00",
    category_id: 2
  }
]

function seed(knex) {
  return knex("classes").insert(testClasses)
}

module.exports = { seed, testClasses }
