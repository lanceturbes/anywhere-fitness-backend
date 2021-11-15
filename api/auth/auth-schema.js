const yup = require("yup")

const registerSchema = yup.object().shape({
  user_id: yup
    .mixed()
    .oneOf([undefined], "user_id must not be provided"),
  first_name: yup
    .string()
    .trim()
    .required("first name is required")
    .min(3, "invalid first name")
    .max(64, "invalid first name"),
  last_name: yup
    .string()
    .trim()
    .required("last name is required")
    .min(3, "invalid last name")
    .max(64, "invalid last name"),
  username: yup
    .string()
    .trim()
    .required("username is required")
    .min(6, "username must be 6 characters or longer")
    .max(32, "username must be shorter than 32 characters"),
  password: yup
    .string()
    .trim()
    .required("password is required")
    .min(8, "password must be 8 characters or longer")
    .max(64, "password must be shorter than 64 characters"),
  email: yup
    .string()
    .trim()
    .required("email is required")
    .email("email is invalid"),
  emailConfirm: yup
    .string()
    .trim()
    .oneOf([yup.ref("email")], "emails must match")
})

const loginSchema = yup.object().shape({
  username: yup
    .string()
    .trim()
    .required("username is required"),
  password: yup
    .string()
    .trim()
    .required("password is required")
})

module.exports = {
  registerSchema,
  loginSchema
}
