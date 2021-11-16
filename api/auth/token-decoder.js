const jwt = require("jsonwebtoken")

function decodeToken(token, secret) {
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return null
    } else {
      return decoded
    }
  })
}

module.exports = decodeToken
