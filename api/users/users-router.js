const router = require("express").Router()
const User = require("./users-model")

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

module.exports = router
