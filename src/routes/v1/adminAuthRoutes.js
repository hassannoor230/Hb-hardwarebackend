const express = require('express')
const router = express.Router()

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || process.env.ADMIN_PASS || (process.env.NODE_ENV !== 'production' ? 'admin12345' : null)

router.post('/login', (req, res) => {
  try {
    const { password } = req.body

    if (!ADMIN_PASSWORD) {
      return res.status(500).json({
        success: false,
        message: 'Admin password is not configured. Set ADMIN_PASSWORD in the backend Vercel environment variables.'
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

    res.json({
      success: true,
      message: 'Login successful'
    })
  } catch (error) {
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
