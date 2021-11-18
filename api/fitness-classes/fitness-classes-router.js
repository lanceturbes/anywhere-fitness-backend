const router = require("express").Router()
const FitnessClass = require("./fitness-classes-model")
const { checkFitnessClassId } = require("../middleware/check-fitness-class-id")
const { validateNewFitnessClass } = require("../middleware/validate-class")
const checkIfLoggedIn = require("../middleware/check-logged-in")
const decodeToken = require("../auth/token-decoder")
const { JWT_SECRET } = require("../../config")
const { checkIfInstructor, checkIfClassOwner } = require("../middleware/check-instructor")
const checkClassNameTaken = require("../middleware/check-classname-taken")

router.get("/",
  async (req, res, next) => {
    try {
      const fitnessClasses = await FitnessClass.getAll()
      res.status(200).json(fitnessClasses)
    } catch (err) {
      next(err)
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
      next(err)
    }
  }
)

router.post("/",
  checkIfInstructor,
  validateNewFitnessClass,
  checkClassNameTaken,
  async (req, res, next) => {
    try {
      const token = req.headers.authorization
      const userInfo = decodeToken(token, JWT_SECRET)

      const nc = req.body
      let classInfo = {
        category_id: nc.type,
        class_name: nc.name,
        instructor_id: userInfo.user_id,
        intensity: nc.intensity,
        location: nc.location,
        start_time: nc.start_time
      }
      if (nc.duration) {
        classInfo.duration = nc.duration
      }
      else if (nc.max_class_size) {
        classInfo.max_class_size = nc.max_class_size
      }

      const fitnessClass = await FitnessClass
        .add(classInfo, userInfo.user_id)
      res.status(201).json({
        message: "Class created successfully!",
        newClass: fitnessClass
      })
    } catch (err) {
      next(err)
    }
  }
)

router.get("/:id/join",
  checkIfLoggedIn,
  checkFitnessClassId,
  async (req, res, next) => {
    try {
      const class_id = req.params.id
      const { user_id } = req.custom_user
      await FitnessClass.addClient({ user_id, class_id })
      res.status(200).json({
        message: "Successfully joined class!"
      })
    } catch (err) {
      next(err)
    }
  }
)

router.delete("/:id",
  checkFitnessClassId,
  checkIfClassOwner,
  async (req, res, next) => {
    try {
      const class_id = req.params.id
      await FitnessClass.removeById(class_id)
      res.status(200).json({
        message: "Successfully deleted class!"
      })
    } catch (err) {
      next(err)
    }
  }
)

module.exports = router
