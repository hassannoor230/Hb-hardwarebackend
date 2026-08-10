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
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean)

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
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
      api: '/api/v1',
      products: '/api/v1/products',
      services: '/api/v1/services'
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
