const {
  registerSchema,
  loginSchema
} = require("../auth/auth-schema")

const validateRegistration = async (req, res, next) => {
  try {
    const payload = req.body
    await registerSchema.validate(payload)
    next()
  } catch (err) {
    next({
      status: 400,
      message: err.errors[0]
    })
  }
}

const validateLogin = async (req, res, next) => {
  try {
    const payload = req.body
    await loginSchema.validate(payload)
    next()
  } catch (err) {
    next({
      status: 400,
      message: err.errors[0]
    })
  }
}

module.exports = {
  validateRegistration,
  validateLogin
}
