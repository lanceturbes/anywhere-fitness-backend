const router = require("express").Router()
const User = require("./users-model")
const { checkUserId } = require("../middleware/check-user-id")

router.get("/",
  async (req, res, next) => {
    try {
      const users = await User.getAll()
      res.status(200).json(users)
    } catch (err) {
      next(err)
    }
  }
)

router.get("/:id",
  checkUserId,
  async (req, res, next) => {
    try {
      const user = req.custom_user
      res.status(200).json(user)
    } catch (err) {
      next(err)
    }
  }
)

router.get("/:id/classes",
  checkUserId,
  async (req, res, next) => {
    try {
      const { id } = req.params
      const classRecords = await User.getClassesByUserId(id)
      res.status(200).json(classRecords)
    } catch (err) {
      next(err)
    }
  }
)

module.exports = router
