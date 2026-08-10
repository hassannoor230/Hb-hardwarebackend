const Joi = require('joi')

const contactSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name cannot exceed 50 characters'
  }),
  phone: Joi.string().min(10).required().messages({
    'string.empty': 'Phone number is required',
    'string.min': 'Please enter a valid phone number'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address',
    'string.empty': 'Email is required'
  }),
  message: Joi.string().min(10).max(500).required().messages({
    'string.empty': 'Message is required',
    'string.min': 'Message must be at least 10 characters',
    'string.max': 'Message cannot exceed 500 characters'
  })
})

const quoteSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name cannot exceed 50 characters'
  }),
  phone: Joi.string().min(10).required().messages({
    'string.empty': 'Phone number is required',
    'string.min': 'Please enter a valid phone number'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address',
    'string.empty': 'Email is required'
  }),
  productCategory: Joi.string().required().messages({
    'string.empty': 'Product category is required'
  }),
  message: Joi.string().min(10).max(500).required().messages({
    'string.empty': 'Message is required',
    'string.min': 'Message must be at least 10 characters',
    'string.max': 'Message cannot exceed 500 characters'
  })
})

exports.validateContact = (data) => {
  return contactSchema.validate(data, { abortEarly: false })
}

exports.validateQuote = (data) => {
  return quoteSchema.validate(data, { abortEarly: false })
}