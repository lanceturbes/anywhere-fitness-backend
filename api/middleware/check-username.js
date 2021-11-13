const User = require("../users/users-model")

const checkUserExists = async (req, res, next) => {
  const { username } = req.custom_login
  const users = await User.filterBy({ username })
  if (users.length === 0) {
    next({
      status: 400,
      message: "invalid credentials"
    })
  } else {
    req.custom_existingUser = users[0]
    next()
  }
}

const checkUsernameTaken = async (req, res, next) => {
  const { username } = req.custom_registration
  const users = await User.filterBy({ username })
  if (users.length !== 0) {
    next({
      status: 400,
      message: "username taken"
    })
  } else {
    next()
  }
}

module.exports = {
  checkUserExists,
  checkUsernameTaken
}
