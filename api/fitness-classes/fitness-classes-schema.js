const yup = require("yup")

const fitnessClassSchema = yup.object().shape({
  attendees: yup
    .mixed()
    .oneOf([undefined], "cannot set attendees"),
  class_id: yup
    .number()
    .oneOf([undefined], "cannot set class id"),
  instructor_id: yup
    .number()
    .oneOf([undefined], "cannot set instructor id"),
  name: yup
    .string()
    .trim()
    .required("class name is required")
    .min(5, "invalid class name")
    .max(64, "invalid class name"),
  intensity: yup
    .number()
    .typeError("invalid intensity")
    .required("intensity is required")
    .min(1, "invalid intensity")
    .max(3, "invalid intensity"),
  location: yup
    .string()
    .trim()
    .required("location is required")
    .min(6, "invalid location")
    .max(128, "invalid location"),
  max_class_size: yup
    .number()
    .typeError("invalid class size")
    .min(5, "invalid class size")
    .max(200, "invalid class size"),
  duration: yup
    .number()
    .typeError("invalid duration")
    .min(15, "invalid duration")
    .max(1440, "invalid duration"),
  type: yup
    .number()
    .typeError("invalid class type")
    .required("class type is required")
    .min(1, "invalid class type")
    .max(5, "invalid class type"),
  start_time: yup
    .string()
    .required("start time is required")
    .matches(/[0-2][0-9]:[0-5][0-9]:[0-5][0-9]/i, "invalid time")
})

module.exports = fitnessClassSchema
