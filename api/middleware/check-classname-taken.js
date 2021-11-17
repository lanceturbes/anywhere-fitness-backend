const FitnessClass = require("../fitness-classes/fitness-classes-model")

async function checkClassNameTaken(req, res, next) {
  const { name } = req.body
  const classes = await FitnessClass.filterBy({ class_name: name })
  if (classes.length !== 0) {
    next({
      status: 400,
      message: "class name taken"
    })
  } else {
    next()
  }
}

module.exports = checkClassNameTaken
