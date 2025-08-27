import Joi from "joi";

export const helpValidationSchema = Joi.object({
  name: Joi.string()
    .pattern(/^[A-Za-z ]+$/)
    .required()
    .messages({
      "string.empty": "Name is required",
      "string.pattern.base": "Invalid Name (only letters and spaces allowed)",
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Invalid email address",
    }),

  phoneNo: Joi.string()
    .pattern(/^(\+91[\-\s]?)?[6-9]\d{9}$/)
    .required()
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base": "Invalid phone number",
    }),

  msg: Joi.string()
    .pattern(/^[a-zA-Z0-9 .,!?'-]+$/)
    .min(5)
    .max(500)
    .required()
    .messages({
      "string.empty": "Message is required",
      "string.pattern.base": "Message contains invalid characters",
    }),
});
