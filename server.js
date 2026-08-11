const dotenv = require('dotenv')
const path = require('path')

dotenv.config({ path: path.join(__dirname, '.env') })

const app = require('./app')
const connectDB = require('./src/config/database')

const startServer = async () => {
  const dbOk = await connectDB()

  const PORT = parseInt(process.env.PORT, 10) || 5000

  if (process.env.VERCEL !== '1') {
    const server = app.listen(PORT, () => {
      console.log('='.repeat(60))
      console.log('🚀 HB Hardware Backend Server')
      console.log(`📍 Running on: http://localhost:${PORT}`)
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
      console.log(`📡 API Base: http://localhost:${PORT}/api/v1`)
      console.log(`❤️  Health Check: http://localhost:${PORT}/health`)
      console.log('='.repeat(60))
    })

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.warn(`⚠️ Port ${PORT} is already in use. Trying port ${PORT + 1}...`)
        startServer(PORT + 1)
      } else {
        console.error('❌ Server failed to start:', error)
        process.exit(1)
      }
    })

    process.on('unhandledRejection', (err) => {
      console.error('❌ Unhandled Rejection:', err)
      server.close(() => process.exit(1))
    })

    process.on('uncaughtException', (err) => {
      console.error('❌ Uncaught Exception:', err)
      server.close(() => process.exit(1))
    })

    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully...')
      server.close(() => process.exit(0))
    })

    process.on('SIGINT', () => {
      console.log('SIGINT received. Shutting down gracefully...')
      server.close(() => process.exit(0))
    })
  }

  return dbOk
}

startServer().catch((err) => {
  console.error('❌ Failed to start server:', err)
  process.exit(1)
})

module.exports = app
