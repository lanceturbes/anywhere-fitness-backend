const decodeToken = require("../auth/token-decoder")
const { JWT_SECRET } = require("../../config")

function checkIfInstructor(req, res, next) {
  const token = req.headers.authorization
  const tokenPayload = decodeToken(token, JWT_SECRET)
  const role_id = tokenPayload.role_id

  if (role_id !== 2) {
    next({
      status: 401,
      message: "access denied"
    })
  } else {
    next()
  }
}

function checkIfClassOwner(req, res, next) {
  const instructor = req.custom_class.instructor

  const token = req.headers.authorization
  const tokenPayload = decodeToken(token, JWT_SECRET)
  const { name } = tokenPayload

  if (name !== instructor) {
    next({
      status: 401,
      message: "access denied"
    })
  } else {
    next()
  }
}

module.exports = {
  checkIfInstructor,
  checkIfClassOwner
}
