const db = require("../../data/db-config")

const getAll = async () => {
  const users = await db("users")
    .select("user_id",
      "username",
      "email")
  return users
}

const getById = async (id) => {
  const user = await db("users")
    .where({ user_id: id })
    .first()
  return user
}

const filterBy = async (filter) => {
  const filteredUsers = await db("users")
    .where(filter)
  return filteredUsers
}

const add = async (user) => {
  const insertResult = await db("users")
    .insert(user)
    .returning([
      "user_id",
      "username",
      "email"
    ])
  const newUser = insertResult[0]
  return newUser
}

module.exports = {
  getAll,
  getById,
  filterBy,
  add
}
