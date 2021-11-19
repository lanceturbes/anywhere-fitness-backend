const db = require("../../data/db-config")

async function getAll() {
  const fitnessClasses = await db("classes as cl")
    .leftJoin("users as u",
      "cl.instructor_id", "u.user_id")
    .leftJoin("intensities as i",
      "cl.intensity", "i.intensity_id")
    .leftJoin("categories as ca",
      "cl.category_id", "ca.category_id")
    .orderBy("class_id")
  if (fitnessClasses.length > 0) {
    const displayedClasses = fitnessClasses.map(fc => {
      return {
        attendees: fc.attendees,
        id: fc.class_id,
        duration: fc.duration,
        instructor: fc.first_name + " " + fc.last_name,
        intensity: fc.intensity_level,
        location: fc.location,
        max_class_size: fc.max_class_size,
        name: fc.class_name,
        start_time: fc.start_time,
        type: fc.category_name
      }
    })
    return displayedClasses
  } else {
    return []
  }
}

async function getById(id) {
  const fitnessClass = await db("classes as cl")
    .leftJoin("users as u",
      "cl.instructor_id", "u.user_id")
    .leftJoin("intensities as i",
      "cl.intensity", "i.intensity_id")
    .leftJoin("categories as ca",
      "cl.category_id", "ca.category_id")
    .where({ class_id: id })
    .first()
  if (fitnessClass) {
    const fc = fitnessClass
    return {
      attendees: fc.attendees,
      id: fc.class_id,
      duration: fc.duration,
      instructor: fc.first_name + " " + fc.last_name,
      intensity: fc.intensity_level,
      location: fc.location,
      max_class_size: fc.max_class_size,
      name: fc.class_name,
      start_time: fc.start_time,
      type: fc.category_name
    }
  } else {
    return undefined
  }
}

async function filterBy(filter) {
  const classes = await db("classes as cl")
    .leftJoin("users as uc",
      "cl.instructor_id", "uc.user_id")
    .leftJoin("intensities as i",
      "cl.intensity", "i.intensity_id")
    .leftJoin("categories as ca",
      "cl.category_id", "ca.category_id")
    .leftJoin("classes_instructors as c_i",
      "c_i.instructor_id", "cl.instructor_id")
    .leftJoin("users as ui",
      "c_i.instructor_id", "ui.user_id")
    .where(filter)
  if (classes.length > 0) {
    return classes.map(fc => {
      return {
        attendees: fc.attendees,
        id: fc.class_id,
        duration: fc.duration,
        instructor: `${fc.first_name} ${fc.last_name}`,
        intensity: fc.intensity_level,
        location: fc.location,
        max_class_size: fc.max_class_size,
        name: fc.class_name,
        start_time: fc.start_time,
        type: fc.category_name
      }
    })
  } else {
    return []
  }
}

async function add(classToAdd, instructorId) {
  let newClass
  await db.transaction(async trx => {
    // Create new class
    const [newRecord] = await trx("classes")
      .insert(classToAdd)
      .returning(["class_id"])
    const classId = newRecord.class_id
    newClass = getById(classId)

    // Add the instructor to the new class
    await trx("classes_clients")
      .insert({
        user_id: instructorId,
        class_id: classId
      })
  })
  return newClass
}

async function addClient(class_client) {
  const record = await db("classes_clients")
    .insert(class_client)
    .returning("*")
  return record
}

async function removeById(classId) {
  const deletedRecords = await db("classes")
    .where({ class_id: classId })
    .del()
    .returning(["class_id"])
  return deletedRecords
}

async function clientIsAttending(classId, clientId) {
  const records = await db("classes_clients")
    .where({
      class_id: classId,
      user_id: clientId
    })
  if (records.length !== 0) {
    return true
  } else {
    return false
  }
}

module.exports = {
  add,
  addClient,
  clientIsAttending,
  filterBy,
  getAll,
  getById,
  removeById
}
