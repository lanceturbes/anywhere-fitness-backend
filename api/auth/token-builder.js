const jwt = require("jsonwebtoken")

const { JWT_SECRET } = require("../../config")

const buildToken = user => {
  const payload = {
    subject: user.user_id,
    username: user.username,
    email: user.email,
    role_id: user.role_id
  }
  const options = {
    expiresIn: "5m"
  }
  const signedToken = jwt.sign(payload, JWT_SECRET, options)
  return signedToken
}

module.exports = buildToken
