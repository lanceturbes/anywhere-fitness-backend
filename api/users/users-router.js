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
      res.status(200).json({
        user_id: user.user_id,
        name: user.first_name + " " + user.last_name,
        email: user.email,
        username: user.username
      })
    } catch (err) {
      next(err)
    }
  }
)

module.exports = router
