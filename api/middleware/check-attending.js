const FitnessClass = require("../fitness-classes/fitness-classes-model")

async function checkIfAttending(req, res, next) {
  const { user_id } = req.custom_user
  const class_id = req.params.id
  const isAttending = await FitnessClass
    .clientIsAttending(class_id, user_id)
  if (isAttending) {
    next({
      status: 400,
      message: "already attending"
    })
  } else {
    next()
  }
}

module.exports = checkIfAttending
