const express = require('express')
const mongoose = require('mongoose')
const { Cart } = require('../models/Cart')
const { Product } = require('../models/Product')

const cartRouter = express.Router()

function requireUserId(req, res) {
  const userId = req.query.userId || req.body?.userId
  if (!userId) {
    res.status(400).json({ error: { message: 'userId is required' } })
    return null
  }
  if (!mongoose.isValidObjectId(userId)) {
    res.status(400).json({ error: { message: 'userId is invalid' } })
    return null
  }
  return String(userId)
}

async function getOrCreateCart(userId) {
  const existing = await Cart.findOne({ userId })
  if (existing) return existing
  return Cart.create({ userId, items: [] })
}

// GET /api/cart?userId=...
cartRouter.get('/', async (req, res, next) => {
  try {
    const userId = requireUserId(req, res)
    if (!userId) return
    const cart = await getOrCreateCart(userId)
    await cart.populate('items.productId')
    res.json(cart)
  } catch (err) {
    next(err)
  }
})

// POST /api/cart/add { userId, productId, size?, qty? }
cartRouter.post('/add', async (req, res, next) => {
  try {
    const userId = requireUserId(req, res)
    if (!userId) return
    const { productId, size = null, qty = 1 } = req.body || {}
    if (!productId || !mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ error: { message: 'valid productId required' } })
    }

    const product = await Product.findById(productId).select('_id')
    if (!product) return res.status(404).json({ error: { message: 'Product not found' } })

    const q = Math.max(1, Number(qty) || 1)
    const cart = await getOrCreateCart(userId)

    const idx = cart.items.findIndex(
      (i) => String(i.productId) === String(productId) && String(i.size || '') === String(size || ''),
    )
    if (idx === -1) cart.items.push({ productId, size: size || null, qty: q })
    else cart.items[idx].qty += q

    await cart.save()
    await cart.populate('items.productId')
    res.json(cart)
  } catch (err) {
    next(err)
  }
})

// POST /api/cart/setQty { userId, productId, size?, qty }
cartRouter.post('/setQty', async (req, res, next) => {
  try {
    const userId = requireUserId(req, res)
    if (!userId) return
    const { productId, size = null, qty } = req.body || {}
    if (!productId || !mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ error: { message: 'valid productId required' } })
    }
    const q = Math.max(1, Number(qty) || 1)

    const cart = await getOrCreateCart(userId)
    const idx = cart.items.findIndex(
      (i) => String(i.productId) === String(productId) && String(i.size || '') === String(size || ''),
    )
    if (idx === -1) {
      return res.status(404).json({ error: { message: 'Cart item not found' } })
    }
    cart.items[idx].qty = q
    await cart.save()
    await cart.populate('items.productId')
    res.json(cart)
  } catch (err) {
    next(err)
  }
})

// POST /api/cart/remove { userId, productId, size? }
cartRouter.post('/remove', async (req, res, next) => {
  try {
    const userId = requireUserId(req, res)
    if (!userId) return
    const { productId, size = null } = req.body || {}
    if (!productId || !mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ error: { message: 'valid productId required' } })
    }

    const cart = await getOrCreateCart(userId)
    cart.items = cart.items.filter(
      (i) => !(String(i.productId) === String(productId) && String(i.size || '') === String(size || '')),
    )
    await cart.save()
    await cart.populate('items.productId')
    res.json(cart)
  } catch (err) {
    next(err)
  }
})

// POST /api/cart/clear { userId }
cartRouter.post('/clear', async (req, res, next) => {
  try {
    const userId = requireUserId(req, res)
    if (!userId) return
    const cart = await getOrCreateCart(userId)
    cart.items = []
    await cart.save()
    await cart.populate('items.productId')
    res.json(cart)
  } catch (err) {
    next(err)
  }
})

module.exports = { cartRouter }

