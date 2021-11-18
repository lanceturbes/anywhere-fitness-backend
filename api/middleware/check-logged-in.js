const decodeToken = require("../auth/token-decoder")
const { JWT_SECRET } = require("../../config")

function checkIfLoggedIn(req, res, next) {
  const token = req.headers.authorization
  const tokenPayload = decodeToken(token, JWT_SECRET)
  req.custom_user = tokenPayload

  if (!tokenPayload.role_id) {
    next({
      status: 401,
      message: "access denied"
    })
  } else {
    next()
  }
}

module.exports = checkIfLoggedIn
