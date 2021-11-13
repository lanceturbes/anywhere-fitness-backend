const router = require("express").Router()
const bcrypt = require("bcryptjs")

const User = require("../users/users-model")
const { BCRYPT_ROUNDS } = require("../../config")
// const buildToken = require("./token-builder")
const {
  validateRegistration
} = require("../middleware/validate-credentials")
const {
  checkUsernameTaken
} = require("../middleware/check-username")

router.post("/register",
  validateRegistration,
  checkUsernameTaken,
  async (req, res, next) => {
    try {
      let registrationInfo = req.custom_registration
      const hash = bcrypt.hashSync(registrationInfo.password, BCRYPT_ROUNDS)
      registrationInfo.password = hash

      const newUser = await User.add(registrationInfo)
      res.status(201).json({
        message: "New user registered, successfully!",
        user: newUser
      })
    } catch (err) {
      next(err)
    }
  }
)

module.exports = router
