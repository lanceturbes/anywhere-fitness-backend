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
        email: usr.email,
        role_id: usr.role_id
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

async function getClassesByUserId(id) {
  const classRecords = await db("classes as cl")
    .leftJoin("classes_clients as c_c",
      "cl.class_id", "c_c.class_id")
    .leftJoin("users as uc",
      "c_c.user_id", "uc.user_id")
    .leftJoin("intensities as i",
      "i.intensity_id", "cl.intensity")
    .leftJoin("categories as ca",
      "ca.category_id", "cl.category_id")
    .leftJoin("classes_instructors as c_i",
      "c_i.instructor_id", "cl.instructor_id")
    .leftJoin("users as ui",
      "c_i.instructor_id", "ui.user_id")
    .select("cl.class_id as id",
      "cl.duration as duration",
      "cl.location as location",
      "cl.class_name as name",
      "cl.start_time as start_time",
      "i.intensity_level as intensity",
      "uc.first_name as instructor_first_name",
      "uc.last_name as instructor_last_name",
      "cl.max_class_size as max_class_size",
      "ca.category_name as type")
    .where({ "uc.user_id": id })
    .orderBy("id")

  const classAttendeeTally = await db("classes as cl")
    .select("cl.class_id as class_id")
    .count("cl.class_id as attendees")
    .leftJoin("classes_clients as c_c",
      "cl.class_id", "c_c.class_id")
    .groupBy("cl.class_id")
    .orderBy("cl.class_id")

  return classRecords.map(record => {
    const cleanedRecord = {
      ...record,
      attendees: parseInt(classAttendeeTally[record.id - 1].attendees),
      instructor: record.instructor_first_name +
        " " + record.instructor_last_name
    }
    delete cleanedRecord.instructor_first_name
    delete cleanedRecord.instructor_last_name
    return cleanedRecord
  })
}

module.exports = {
  getClassesByUserId,
  getAll,
  getById,
  filterBy,
  add
}
