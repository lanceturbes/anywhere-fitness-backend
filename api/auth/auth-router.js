const router = require("express").Router()
const bcrypt = require("bcryptjs")

const User = require("../users/users-model")
const { BCRYPT_ROUNDS, INSTRUCTOR_CODE } = require("../../config")
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
      let regInfo = { ...req.body }
      delete regInfo.emailConfirm

      const hash = bcrypt.hashSync(regInfo.password, BCRYPT_ROUNDS)
      regInfo.password = hash

      const newUser = await User.add(regInfo)
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
      const { password, instructor_auth } = req.body

      // Assign Role
      let user = { ...req.custom_user, role: "client" }
      if (instructor_auth === INSTRUCTOR_CODE) {
        user.role = "instructor"
      }

      // Check Password
      const passwordIsValid = bcrypt.compareSync(password, user.password)
      if (passwordIsValid) {
        delete user.password
        res.status(200).json({
          message: `Welcome, ${user.username}!`,
          token: buildToken(user),
          user
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
