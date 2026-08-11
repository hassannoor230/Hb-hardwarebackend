const dotenv = require('dotenv')
const path = require('path')

dotenv.config({ path: path.join(__dirname, '..', '.env') })

const app = require('../app')
const connectDB = require('../src/config/database')

let isConnected = false

const ensureDB = async () => {
  if (isConnected) return true
  const ok = await connectDB()
  if (ok) isConnected = true
  return ok
}

module.exports = async (req, res) => {
  await ensureDB()
  return app(req, res)
}
