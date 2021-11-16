const FitnessClass = require("../fitness-classes/fitness-classes-model.js")

async function checkFitnessClassId(req, res, next) {
  const { id } = req.params
  const fitnessClass = await FitnessClass.getById(id)
  if (fitnessClass) {
    req.custom_class = fitnessClass
    next()
  } else {
    next({
      status: 404,
      message: "class not found"
    })
  }
}

module.exports = { checkFitnessClassId }
