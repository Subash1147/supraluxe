const express = require('express')
const bcrypt = require('bcryptjs')
const { User } = require('../models/User')

const usersRouter = express.Router()
const SALT_ROUNDS = 10

// ============================================================================
// IMPORTANT: More specific routes must be defined BEFORE generic routes!
// ============================================================================

// GET /api/users (get all users - admin only)
usersRouter.get('/', async (_req, res) => {
  try {
    const items = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(100)
    return res.json({ success: true, items })
  } catch (err) {
    console.error('Get all users error:', err)
    return res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch users' },
    })
  }
})

// POST /api/users (register - must be after /login)
usersRouter.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body || {}
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: { message: 'name, email, and password required' },
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid email format' },
      })
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: { message: 'Password must be at least 6 characters' },
      })
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    const role = 'customer' // Default role, admin roles handled by Firebase
    const created = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    })

    const safeUser = {
      id: created._id,
      name: created.name,
      email: created.email,
      role: created.role,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
      lastLogin: created.lastLogin,
    }

    return res.status(201).json({
      success: true,
      user: safeUser,
    })
  } catch (err) {
    // duplicate email
    if (err && err.code === 11000) {
      return res.status(409).json({
        success: false,
        error: { message: 'Email already registered' },
      })
    }
    console.error('Registration error:', err)
    return res.status(500).json({
      success: false,
      error: { message: 'Registration failed. Please try again.' },
    })
  }
})

// GET /api/users/:id (get specific user)
usersRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const item = await User.findById(id).select('-password')
    if (!item) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' },
      })
    }
    return res.json({ success: true, user: item })
  } catch (err) {
    console.error('Get user error:', err)
    return res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch user' },
    })
  }
})

// PUT /api/users/:id (update user - admin only)
usersRouter.put('/:id', async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select('-password')
    if (!updated) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' },
      })
    }
    return res.json({ success: true, user: updated })
  } catch (err) {
    console.error('Update user error:', err)
    return res.status(500).json({
      success: false,
      error: { message: 'Failed to update user' },
    })
  }
})

// DELETE /api/users/:id (delete user - admin only)
usersRouter.delete('/:id', async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id)
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' },
      })
    }
    return res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    })
  } catch (err) {
    console.error('Delete user error:', err)
    return res.status(500).json({
      success: false,
      error: { message: 'Failed to delete user' },
    })
  }
})

module.exports = { usersRouter }

