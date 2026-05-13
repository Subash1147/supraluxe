const express = require('express')
const { Product } = require('../models/Product')
const { Order } = require('../models/Order')
const { User } = require('../models/User')

const adminRouter = express.Router()

// GET /api/admin/dashboard
adminRouter.get('/dashboard', async (req, res) => {
  try {
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 100))

    const [products, orders, users] = await Promise.all([
      Product.find().sort({ createdAt: -1 }).limit(limit),
      Order.find().sort({ createdAt: -1 }).limit(limit).populate('userId', 'name email'),
      User.find().select('-password').sort({ createdAt: -1 }).limit(limit),
    ])

    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0)

    return res.json({
      success: true,
      products,
      orders,
      users,
      summary: {
        totalRevenue,
        totalOrders: orders.length,
        totalUsers: users.length,
      },
    })
  } catch (err) {
    console.error('Admin dashboard error:', err)
    return res.status(500).json({
      success: false,
      error: { message: 'Failed to load admin dashboard data' },
    })
  }
})

module.exports = { adminRouter }
