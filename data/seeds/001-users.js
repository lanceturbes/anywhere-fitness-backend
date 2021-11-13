const users = [
  {
    username: "willie-wonka",
    password: "$2a$06$GpPRvzwBls/o5Ixmv9jgEOHgR6wL08EZCjMfd5uK4mOan7RtVdVlm",
    email: "willie@gmail.com"
  },
]

const seed = async knex => {
  await knex("users").truncate()
  return knex("users").insert(users)
}

module.exports = { seed, users }
