const fitnessClassSchema = require("../fitness-classes/fitness-classes-schema")

async function validateNewFitnessClass(req, res, next) {
  try {
    const payload = req.body
    await fitnessClassSchema.validate(payload)
    next()
  } catch (err) {
    next({
      status: 400,
      message: err.errors[0]
    })
  }
}

module.exports = { validateNewFitnessClass }
