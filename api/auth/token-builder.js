const jwt = require("jsonwebtoken")

const { JWT_SECRET } = require("../../config")

const buildToken = user => {
  const payload = {
    subject: user.id,
    user_id: user.id,
    username: user.username,
    name: user.name,
    email: user.email,
    role_id: user.role_id
  }
  const options = {
    expiresIn: "15m"
  }
  const signedToken = jwt.sign(payload, JWT_SECRET, options)
  return signedToken
}

module.exports = buildToken
