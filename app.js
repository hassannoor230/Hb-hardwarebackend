const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const rateLimit = require('express-rate-limit')
const path = require('path')

const errorHandler = require('./src/middleware/errorHandler')
const routes = require('./src/routes')

const app = express()

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
}))

// CORS
const normalizeOrigin = (value) => {
  if (!value) return ''

  try {
    return new URL(value.trim()).origin
  } catch (error) {
    return value.trim().replace(/\/+$/, '')
  }
}

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map(normalizeOrigin)
  .filter(Boolean)

const corsOptions = {
  origin: function (origin, callback) {
    const normalizedOrigin = normalizeOrigin(origin)

    if (!origin || allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
})
app.use('/api', limiter)

// Compression
app.use(compression())

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
} else {
  app.use(morgan('combined'))
}

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())

// Static files
const { UPLOAD_DIR } = require('./src/config/constants')
app.use('/uploads', express.static(UPLOAD_DIR))

// Favicon handler - return empty response to avoid 500 errors
app.get('/favicon.ico', (req, res) => {
  res.status(204).send()
})

// Root handler
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'HB Hardware Backend API',
    version: '1.0.0',
    status: 'OK',
    endpoints: {
      health: '/health',
      api: '/api',
      api_v1: '/api/v1',
      products: '/api/v1/products',
      services: '/api/v1/services'
    }
  })
})

app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'HB Hardware Backend API',
    version: '1.0.0',
    status: 'OK',
    endpoints: {
      health: '/api/health',
      api_v1: '/api/v1',
      products: '/api/v1/products',
      services: '/api/v1/services'
    }
  })
})

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  })
})

app.get('/api/v1', (req, res) => {
  res.json({
    success: true,
    message: 'HB Hardware API v1',
    version: '1.0.0',
    status: 'OK',
    endpoints: {
      health: '/api/v1/health',
      products: '/api/v1/products',
      services: '/api/v1/services',
      admin: '/api/v1/admin'
    }
  })
})

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  })
})

// API Routes
app.use('/api/v1', routes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  })
})

// Error handler
app.use(errorHandler)

module.exports = app
