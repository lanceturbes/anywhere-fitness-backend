const classInstructors = [
  { class_id: 1, instructor_id: 2 },
  { class_id: 2, instructor_id: 1 },
  { class_id: 3, instructor_id: 5 },
  { class_id: 4, instructor_id: 4 },
  { class_id: 5, instructor_id: 3 },
]

exports.seed = function (knex) {
  return knex("classes_instructors").insert(classInstructors)
}
