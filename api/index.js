const dotenv = require('dotenv')
const path = require('path')

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') })

const app = require('../app')
const connectDB = require('../src/config/database')

// Connect to MongoDB
connectDB()

module.exports = (req, res) => {
  return app(req, res)
}
