const express = require('express')
const { Order } = require('../models/Order')

const ordersRouter = express.Router()

// GET /api/orders
ordersRouter.get('/', async (req, res, next) => {
  try {
    const { status, limit = '50', page = '1' } = req.query

    const filter = {}
    if (status) filter.status = status

    const perPage = Math.min(100, Math.max(1, Number(limit) || 50))
    const p = Math.max(1, Number(page) || 1)
    const skip = (p - 1) * perPage

    const [items, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(perPage).populate('userId', 'name email'),
      Order.countDocuments(filter),
    ])

    res.json({ items, page: p, limit: perPage, total })
  } catch (err) {
    next(err)
  }
})

// GET /api/orders/:id
ordersRouter.get('/:id', async (req, res, next) => {
  try {
    const item = await Order.findById(req.params.id).populate('userId', 'name email')
    if (!item) return res.status(404).json({ error: { message: 'Order not found' } })
    res.json(item)
  } catch (err) {
    next(err)
  }
})

// POST /api/orders
ordersRouter.post('/', async (req, res) => {
  try {
    console.log('Order POST route called with body:', req.body)

    const { userId, items, total, shippingAddress, customerName, customerEmail } = req.body
    const requiredFields = ['name', 'email', 'phone', 'address', 'city', 'postalCode']
    const missingFields = []

    if (!shippingAddress || typeof shippingAddress !== 'object') {
      return res.status(400).json({ error: { message: 'Shipping address is required' } })
    }

    requiredFields.forEach((field) => {
      if (!shippingAddress[field] || !String(shippingAddress[field]).trim()) {
        missingFields.push(field)
      }
    })

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: {
          message: `Missing required shipping address fields: ${missingFields.join(', ')}`,
        },
      })
    }

    const order = await Order.create({
      userId,
      items,
      total,
      customerName,
      customerEmail,
      shippingAddress,
    })

    res.status(201).json(order)
  } catch (err) {
    console.error('Order creation failed:', err)
    res.status(500).json({ error: { message: err.message || 'Failed to create order' } })
  }
})

// PUT /api/orders/:id
ordersRouter.put('/:id', async (req, res, next) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!updated) return res.status(404).json({ error: { message: 'Order not found' } })
    res.json(updated)
  } catch (err) {
    next(err)
  }
})

// DELETE /api/orders/:id
ordersRouter.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ error: { message: 'Order not found' } })
    res.status(204).send()
  } catch (err) {
    next(err)
  }
})

module.exports = { ordersRouter }