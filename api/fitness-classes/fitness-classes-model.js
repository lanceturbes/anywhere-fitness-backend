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
    .leftJoin("users as u",
      "cl.instructor_id", "u.user_id")
    .leftJoin("intensities as i",
      "cl.intensity", "i.intensity_id")
    .leftJoin("categories as ca",
      "cl.category_id", "ca.category_id")
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

async function add(newClass) {
  const [newRecord] = await db("classes")
    .insert(newClass)
    .returning(["class_id"])
  return await getById(newRecord.class_id)
}

module.exports = {
  add,
  filterBy,
  getAll,
  getById
}
