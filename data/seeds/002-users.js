const users = [
  {
    username: "waywardpooch",
    password: "$2a$16$rmr6vB/MtELrFn38Ib/JKu1sS3OXmYrTrfUaLEZ2bXnVjKu3vuziO",
    email: "waywardpooch@placeholder.test"
  }
]

function seed(knex) {
  return knex("users").insert(users)
}

module.exports = { seed }
