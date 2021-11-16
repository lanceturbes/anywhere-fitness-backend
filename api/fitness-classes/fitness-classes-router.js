const router = require("express").Router()
const FitnessClass = require("./fitness-classes-model")
const { checkFitnessClassId } = require("../middleware/check-fitness-class-id")

router.get("/",
  async (req, res, next) => {
    try {
      const fitnessClasses = await FitnessClass.getAll()
      res.status(200).json(fitnessClasses)
    } catch (err) {
      next()
    }
  }
)

router.get("/:id",
  checkFitnessClassId,
  async (req, res, next) => {
    try {
      const fitnessClass = req.custom_class
      res.status(200).json(fitnessClass)
    } catch (err) {
      next()
    }
  }
)

module.exports = router
