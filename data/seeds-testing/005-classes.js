const testClasses = [
  {
    instructor_id: 4,
    class_name: "Castle Black Combat",
    category_id: 5,
    start_time: "05:00:00",
    duration: 120,
    intensity: 3,
    location: "The Wall",
    attendees: 47,
    max_class_size: 64
  },
  {
    instructor_id: 5,
    class_name: "Mario's Run",
    category_id: 2,
    start_time: "07:00:00",
    duration: 80,
    intensity: 2,
    location: "Koopa Troopa Beach",
    attendees: 14,
    max_class_size: 32
  }
]

function seed(knex) {
  return knex("classes").insert(testClasses)
}

module.exports = { seed, testClasses }
