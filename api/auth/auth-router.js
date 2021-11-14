const router = require("express").Router()
const bcrypt = require("bcryptjs")

const User = require("../users/users-model")
const { BCRYPT_ROUNDS } = require("../../config")
const buildToken = require("./token-builder")
const {
  validateLogin,
  validateRegistration
} = require("../middleware/validate-credentials")
const {
  checkUserExists,
  checkUsernameTaken
} = require("../middleware/check-username")

router.post("/register",
  validateRegistration,
  checkUsernameTaken,
  async (req, res, next) => {
    try {
      const { username, password, email } = req.body
      let registrationInfo = { username, password, email }
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

router.post("/login",
  validateLogin,
  checkUserExists,
  async (req, res, next) => {
    try {
      const { password } = req.body
      const user = req.custom_existingUser
      const passwordIsValid = bcrypt.compareSync(password, user.password)

      if (passwordIsValid) {
        res.status(200).json({
          message: `Welcome, ${user.username}!`,
          token: buildToken(user)
        })
      } else {
        next({
          status: 400,
          message: "Invalid Credentials!"
        })
      }
    } catch (err) {
      next(err)
    }
  }
)

module.exports = router
