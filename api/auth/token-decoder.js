const jwt = require("jsonwebtoken")

function decodeToken(token, secret) {
  return jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return err
    } else {
      return decoded
    }
  })
}

module.exports = decodeToken
