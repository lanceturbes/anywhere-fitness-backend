const {
  registerSchema,
  loginSchema
} = require("../auth/auth-schema")

const validateRegistration = async (req, res, next) => {
  try {
    const payload = req.body
    const validatedPayload = await registerSchema.validate(payload)
    req.custom_registration = {
      username: validatedPayload.username,
      password: validatedPayload.password,
      email: validatedPayload.email
    }
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
    const validatedPayload = await loginSchema.validate(payload)
    req.custom_login = validatedPayload
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
