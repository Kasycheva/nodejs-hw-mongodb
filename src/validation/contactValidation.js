import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    "string.base": "The 'name' field must be a string.",
    "string.empty": "The 'name' field cannot be empty.",
    "string.min": "The 'name' field must be at least 3 characters long.",
    "string.max": "The 'name' field must be at most 20 characters long.",
    "any.required": "The 'name' field is required."
  }),
  phoneNumber: Joi.string().min(3).max(20).required().messages({
    "string.base": "The 'phoneNumber' field must be a string.",
    "string.empty": "The 'phoneNumber' field cannot be empty.",
    "string.min": "The 'phoneNumber' field must be at least 3 characters long.",
    "string.max": "The 'phoneNumber' field must be at most 20 characters long.",
    "any.required": "The 'phoneNumber' field is required."
  }),
  email: Joi.string().email().messages({
    "string.email": "The 'email' field must be a valid email address."
  }),
  isFavourite: Joi.boolean().messages({
    "boolean.base": "The 'isFavourite' field must be a boolean."
  }),
  contactType: Joi.string().valid("work", "home", "personal").required().messages({
    "any.only": "The 'contactType' field must be one of 'work', 'home', or 'personal'.",
    "any.required": "The 'contactType' field is required."
  })
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    "string.base": "The 'name' field must be a string.",
    "string.empty": "The 'name' field cannot be empty.",
    "string.min": "The 'name' field must be at least 3 characters long.",
    "string.max": "The 'name' field must be at most 20 characters long."
  }),
  phoneNumber: Joi.string().min(3).max(20).messages({
    "string.base": "The 'phoneNumber' field must be a string.",
    "string.empty": "The 'phoneNumber' field cannot be empty.",
    "string.min": "The 'phoneNumber' field must be at least 3 characters long.",
    "string.max": "The 'phoneNumber' field must be at most 20 characters long."
  }),
  email: Joi.string().email().messages({
    "string.email": "The 'email' field must be a valid email address."
  }),
  isFavourite: Joi.boolean().messages({
    "boolean.base": "The 'isFavourite' field must be a boolean."
  }),
  contactType: Joi.string().valid("work", "home", "personal").messages({
    "any.only": "The 'contactType' field must be one of 'work', 'home', or 'personal'."
  })
}).or("name", "phoneNumber", "email", "isFavourite", "contactType").messages({
  "object.missing": "At least one field must be provided for update."
});
