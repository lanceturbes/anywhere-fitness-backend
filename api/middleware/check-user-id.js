const User = require("../users/users-model")

async function checkUserId(req, res, next) {
  const { id } = req.params
  const user = await User.getById(id)
  if (user) {
    req.custom_user = user
    next()
  } else {
    next({
      status: 404,
      message: "user does not exist"
    })
  }
}

module.exports = { checkUserId }
