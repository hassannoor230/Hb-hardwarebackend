const jwt = require('jsonwebtoken')

// This is a placeholder for future admin authentication
// In a real application, you would implement proper JWT authentication

exports.protect = async (req, res, next) => {
  try {
    let token
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }
    
    if (!token) {
      // For now, we'll allow requests without token
      // In production, you would want to validate the token
      req.user = { email: 'admin@hbhardware.com', role: 'admin' }
      return next()
    }
    
    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = decoded
      next()
    } catch (err) {
      // Token is invalid, but we'll still allow the request for now
      req.user = { email: 'admin@hbhardware.com', role: 'admin' }
      next()
    }
  } catch (error) {
    console.error('Auth error:', error)
    req.user = { email: 'admin@hbhardware.com', role: 'admin' }
    next()
  }
}

exports.adminOnly = async (req, res, next) => {
  try {
    // For now, we'll just pass through
    // In production, check if user has admin role
    req.user = { email: 'admin@hbhardware.com', role: 'admin' }
    next()
  } catch (error) {
    console.error('Auth error:', error)
    res.status(403).json({ 
      success: false,
      message: 'Forbidden - Admin access required' 
    })
  }
}

// Helper function to generate JWT token
exports.generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id,
      email: user.email,
      role: user.role || 'admin'
    },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  )
}