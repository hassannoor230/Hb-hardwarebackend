const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || process.env.ADMIN_PASS || (process.env.NODE_ENV !== 'production' ? 'admin12345' : null)

const generateAdminToken = () => {
  return jwt.sign(
    {
      id: 'admin',
      email: 'admin@hbhardware.com',
      role: 'admin'
    },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  )
}

router.post('/login', (req, res) => {
  try {
    const { password } = req.body

    if (!ADMIN_PASSWORD) {
      return res.status(500).json({
        success: false,
        message: 'Admin password is not configured. Set ADMIN_PASSWORD in the backend environment variables.'
      })
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required'
      })
    }

    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      })
    }

    const token = generateAdminToken()

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        email: 'admin@hbhardware.com',
        role: 'admin'
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Login failed'
    })
  }
})

router.post('/logout', (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Logout successful'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    })
  }
})

module.exports = router
