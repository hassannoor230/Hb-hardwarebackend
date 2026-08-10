const mongoose = require('mongoose')

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.warn('⚠️ MongoDB URI is not configured. Skipping database connection.')
    return false
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      family: 4,
    })
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.warn('MongoDB connection error:', err.message || err)
    })

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected')
    })

    // Handle application termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close()
      console.log('MongoDB connection closed through app termination')
      process.exit(0)
    })

    return true
  } catch (error) {
    console.warn(`⚠️ MongoDB connection warning: ${error.message}. The server will continue running without database access.`)
    return false
  }
}

module.exports = connectDB