const express = require('express')
const bcrypt = require('bcryptjs')
const { User } = require('../models/User')
const { signToken } = require('../server/auth')

const authRouter = express.Router()

// POST /api/auth/login
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {}
    if (!email || !password) {
      return res.status(400).json({ success: false, error: { message: 'email and password are required' } })
    }

    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(401).json({ success: false, error: { message: 'Invalid credentials' } })
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(401).json({ success: false, error: { message: 'Invalid credentials' } })
    }

    const token = signToken({ id: user._id, email: user.email, role: user.role })
    const safeUser = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    }

    return res.status(200).json({ success: true, message: 'Login successful', token, user: safeUser })
  } catch (err) {
    console.error('Auth login error:', err)
    return res.status(500).json({ success: false, error: { message: 'Login failed' } })
  }
})

module.exports = { authRouter }
