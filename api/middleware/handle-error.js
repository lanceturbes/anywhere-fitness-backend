const { NODE_ENV } = require("../../config")

const handleError = (err, req, res, next) => {
  res.status(err.status || 500).json({
    message: NODE_ENV === "production"
      ? "Oh, d-d-d-dear!"
      : err.message || "Oh, d-d-d-dear!"
  })
}

module.exports = handleError
