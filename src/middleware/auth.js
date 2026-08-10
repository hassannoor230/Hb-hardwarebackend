const jwt = require('jsonwebtoken')

exports.protect = async (req, res, next) => {
  try {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route. Please login as admin.'
      })
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = decoded
      next()
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route. Token is invalid or expired.'
      })
    }
  } catch (error) {
    console.error('Auth error:', error)
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    })
  }
}

exports.adminOnly = async (req, res, next) => {
  try {
    if (req.user && req.user.role === 'admin') {
      next()
    } else {
      return res.status(403).json({
        success: false,
        message: 'Forbidden - Admin access required'
      })
    }
  } catch (error) {
    console.error('Auth error:', error)
    return res.status(403).json({
      success: false,
      message: 'Forbidden - Admin access required'
    })
  }
}

exports.generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id || 'admin',
      email: user.email,
      role: user.role || 'admin'
    },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  )
}
