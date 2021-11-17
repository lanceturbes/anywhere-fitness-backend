const roles = [
  {
    role_name: "client"
  },
  {
    role_name: "instructor"
  }
]

exports.seed = function (knex) {
  return knex("roles").insert(roles)
}
