const dotenv = require('dotenv')
const path = require('path')

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') })

const app = require('./app')
const connectDB = require('./src/config/database')

const PORT = parseInt(process.env.PORT, 10) || 5000

// Connect to MongoDB
connectDB()

const startServer = (port, retries = 5) => {
  const server = app.listen(port, () => {
    console.log('='.repeat(60))
    console.log(`🚀 HB Hardware Backend Server`)
    console.log(`📍 Running on: http://localhost:${port}`)
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
    console.log(`📡 API Base: http://localhost:${port}/api/v1`)
    console.log(`❤️  Health Check: http://localhost:${port}/health`)
    console.log('='.repeat(60))
  })

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE' && retries > 0) {
      console.warn(`⚠️ Port ${port} is already in use. Trying port ${port + 1}...`)
      startServer(port + 1, retries - 1)
    } else {
      console.error('❌ Server failed to start:', error)
      process.exit(1)
    }
  })

  return server
}

const server = startServer(PORT)

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err)
  server.close(() => {
    console.log('Server closed due to unhandled rejection')
    process.exit(1)
  })
})

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err)
  server.close(() => {
    console.log('Server closed due to uncaught exception')
    process.exit(1)
  })
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...')
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...')
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})