const db = require("../../data/db-config")

async function getAll() {
  const users = await db("users")
    .orderBy("user_id")
  const displayedUsers = users.map(user => {
    return {
      id: user.user_id,
      name: `${user.first_name} ${user.last_name}`,
      username: user.username,
      email: user.email
    }
  })
  return displayedUsers
}

async function getById(id) {
  const users = await db("users")
    .where({ user_id: id })
  if (users.length === 0) {
    return null
  } else {
    const user = users[0]
    return {
      id: user.user_id,
      name: `${user.first_name} ${user.last_name}`,
      username: user.username,
      email: user.email
    }
  }
}

async function filterBy(filter, withAuth = false) {
  const users = await db("users")
    .where(filter)
    .orderBy("user_id")
  if (users.length === 0) {
    return []
  } else {
    return users.map(usr => {
      let userEntry = {
        id: usr.user_id,
        name: `${usr.first_name} ${usr.last_name}`,
        username: usr.username,
        email: usr.email
      }
      if (withAuth) {
        userEntry.password = usr.password
      }
      return userEntry
    })
  }
}

async function add(usr) {
  const newRecords = await db("users")
    .insert(usr)
    .returning([
      "user_id",
      "first_name",
      "last_name",
      "username",
      "email"
    ])
  const newUser = newRecords[0]
  return {
    id: newUser.user_id,
    name: `${newUser.first_name} ${newUser.last_name}`,
    username: newUser.username,
    email: newUser.email
  }
}

module.exports = {
  getAll,
  getById,
  filterBy,
  add
}
