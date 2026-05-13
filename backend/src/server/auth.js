const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'supraluxe-secret'
const JWT_EXPIRES_IN = '7d'

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET)
}

function getTokenFromRequest(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization || ''
  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7)
  }
  const xAccessToken = req.headers['x-access-token'] || req.headers['X-Access-Token']
  if (typeof xAccessToken === 'string' && xAccessToken.trim()) {
    return xAccessToken.trim()
  }
  return null
}

function authenticate(req, res, next) {
  const token = getTokenFromRequest(req)

  if (!token) {
    return res.status(401).json({
      success: false,
      error: { message: 'Authentication token is required' },
    })
  }

  try {
    req.user = verifyToken(token)
    return next()
  } catch (err) {
    console.error('Token verification failed:', err.message)
    return res.status(401).json({
      success: false,
      error: { message: 'Invalid or expired authentication token' },
    })
  }
}

function requireAdmin(req, res, next) {
  authenticate(req, res, () => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { message: 'Admin access required' },
      })
    }
    next()
  })
}

module.exports = {
  signToken,
  authenticate,
  requireAdmin,
}
