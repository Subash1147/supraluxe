require('dotenv').config()
const { createApp } = require('./server/createApp')
const { connectMongo } = require('./server/mongo')

const PORT = Number(process.env.PORT || 5000)

async function start() {
  const app = createApp()

  // Try MongoDB, but don't crash the server if it's down.
  connectMongo().catch((err) => {
    // eslint-disable-next-line no-console
    console.warn(
      'MongoDB connection failed. API routes will return 503 until MongoDB is running.',
    )
    // eslint-disable-next-line no-console
    console.warn(err?.message || err)
  })

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API running on http://localhost:${PORT}`)
  })
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server:', err)
  process.exitCode = 1
})

