const rateLimit = require('express-rate-limit')

// General rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
})

// Contact form rate limiter (stricter)
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    success: false,
    message: 'Too many contact form submissions, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
})

// Quote form rate limiter (stricter)
const quoteLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    success: false,
    message: 'Too many quote requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
})

// Gallery upload rate limiter
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: {
    success: false,
    message: 'Too many upload attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
})

module.exports = {
  generalLimiter,
  contactLimiter,
  quoteLimiter,
  uploadLimiter
}