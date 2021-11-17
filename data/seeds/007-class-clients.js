const classes_clients = [
  {
    user_id: 3,
    class_id: 1
  },
  {
    user_id: 2,
    class_id: 1
  }
]

exports.seed = function (knex) {
  return knex("classes_clients").insert(classes_clients)
}
