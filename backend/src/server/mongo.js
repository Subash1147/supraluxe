const mongoose = require('mongoose')
const dns = require('dns')
require('dotenv').config()

function normalizeDnsServers() {
  const servers = dns.getServers()
  if (servers.includes('127.0.0.1')) {
    dns.setServers(['8.8.8.8', '1.1.1.1'])
    // eslint-disable-next-line no-console
    console.log('Using public DNS servers for MongoDB SRV resolution')
  }
}

function isMongoConnected() {
  return mongoose.connection && mongoose.connection.readyState === 1
}

async function connectMongo() {
  normalizeDnsServers()

  const uri = process.env.MONGO_URI
  if (!uri) {
    const err = new Error('Missing MONGO_URI in environment')
    err.status = 500
    throw err
  }

  mongoose.set('strictQuery', true)
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
  // eslint-disable-next-line no-console
  console.log('MongoDB connected')
}

module.exports = { connectMongo, isMongoConnected }

