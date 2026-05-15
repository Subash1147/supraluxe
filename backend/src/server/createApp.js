const express = require('express')
const cors = require('cors')

const { productsRouter } = require('../routes/products')
const { usersRouter } = require('../routes/users')
const { cartRouter } = require('../routes/cart')
const { ordersRouter } = require('../routes/orders')
const { paymentsRouter } = require('../routes/payments')
const { adminRouter } = require('../routes/admin')
const { isMongoConnected } = require('./mongo')

function createApp() {
  const app = express()

  const allowedOrigins = new Set([
    'https://done-one-chi.vercel.app',
    'https://done-git-main-subash-m-s-projects.vercel.app',
    'https://done-d6dgf3on0-subash-m-s-projects.vercel.app',
  ])

  if (process.env.CORS_ORIGIN) {
    allowedOrigins.add(process.env.CORS_ORIGIN)
  }

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) {
          return callback(null, true)
        }

        if (allowedOrigins.has(origin)) {
          return callback(null, true)
        }

        if (/^https?:\/\/localhost(:\d+)?$/.test(origin)) {
          return callback(null, true)
        }

        return callback(new Error(`CORS policy denied access from ${origin}`))
      },
      credentials: true,
    }),
  )
  app.use(express.json({ limit: '1mb' }))

  app.get('/', (_req, res) => {
    res.json({ message: 'API server is running. Use /health or /api/* endpoints.' })
  })

  app.get('/health', (_req, res) => {
    res.json({ ok: true, mongo: isMongoConnected() ? 'connected' : 'disconnected' })
  })

  app.use('/api', (req, res, next) => {
    console.log('API middleware called for:', req.path, 'Mongo connected:', isMongoConnected())
    if (isMongoConnected()) {
      console.log('Calling next()')
      return next()
    }
    console.log('Mongo not connected, returning 503')
    return res.status(503).json({
      success: false,
      error: {
        message:
          'MongoDB not connected. Start MongoDB or set a valid MONGO_URI in backend/.env.',
        path: req.path,
      },
    })
  })

  app.use('/api/products', productsRouter)
  app.use('/api/users', usersRouter)
  app.use('/api/cart', cartRouter)
  app.use('/api/orders', ordersRouter)
  app.use('/api/payments', paymentsRouter)
  app.use('/api/admin', adminRouter)

  // 404 handler - must come before error handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: {
        message: `Not Found: ${req.method} ${req.path}`,
      },
    })
  })

  // Global error handler - must be last middleware (4 parameters required)
  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    console.error('Global error handler caught:', err.message, err.stack)
    const status = err.status || err.statusCode || 500
    res.status(status).json({
      success: false,
      error: {
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      },
    })
  })

  return app
}

module.exports = { createApp }

