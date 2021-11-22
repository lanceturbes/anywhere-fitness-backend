const seedClasses = [
  {
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
    category_id: 2,
    class_name: "Pooch's Run",
    duration: 40,
    instructor_id: 1,
    intensity: 2,
    location: "Koopa Troopa Beach",
    max_class_size: 32,
    start_time: "10:00:00"
  },
  {
    category_id: 4,
    class_name: "Zen Fitness",
    duration: 30,
    instructor_id: 5,
    intensity: 1,
    location: "Miyagi's Studio",
    max_class_size: 20,
    start_time: "09:00:00"
  },
  {
    category_id: 1,
    class_name: "Trembling Heights",
    duration: 25,
    instructor_id: 4,
    intensity: 2,
    location: "Rock Climbing Studio",
    max_class_size: 60,
    start_time: "12:00:00"
  },
  {
    category_id: 3,
    class_name: "Stretching Your Pockets",
    duration: 100,
    instructor_id: 3,
    intensity: 3,
    location: "Misty Mountain",
    max_class_size: 50,
    start_time: "14:00:00"
  },
]

function seed(knex) {
  return knex("classes").insert(seedClasses)
}

module.exports = { seed, seedClasses }
