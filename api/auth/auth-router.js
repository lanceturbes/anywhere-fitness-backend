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
      // Hash Password
      let regInfo = { ...req.body }
      const hash = bcrypt.hashSync(regInfo.password, BCRYPT_ROUNDS)
      regInfo.password = hash

      // Check/Set Role
      if (
        regInfo.instructor_auth &&
        regInfo.instructor_auth === INSTRUCTOR_CODE
      ) {
        delete regInfo.instructor_auth
        regInfo.role_id = 2
      } else {
        regInfo.role_id = 1
      }

      // Register New User
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
      const { password } = req.body

      // Assign Role
      const user = { ...req.custom_user }

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
