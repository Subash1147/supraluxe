const express = require('express')
const { Product } = require('../models/Product')

const productsRouter = express.Router()

// GET /api/products?gender=&q=&min=&max=&rating=&sort=
productsRouter.get('/', async (req, res, next) => {
  try {
    const {
      gender,
      category,
      q,
      min,
      max,
      rating,
      sort = 'reco',
      limit = '48',
      page = '1',
    } = req.query

    const filter = {}
    if (gender === 'men' || gender === 'women') filter.gender = gender
    if (category) filter.category = String(category)
    if (min) filter.price = { ...(filter.price || {}), $gte: Number(min) || 0 }
    if (max) filter.price = { ...(filter.price || {}), $lte: Number(max) || 0 }
    if (rating) filter.rating = { $gte: Number(rating) || 0 }

    if (q) {
      filter.$text = { $search: String(q) }
    }

    const sortMap = {
      reco: { createdAt: -1 },
      recommended: { createdAt: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      rating: { rating: -1 },
    }

    const perPage = Math.min(100, Math.max(1, Number(limit) || 48))
    const p = Math.max(1, Number(page) || 1)
    const skip = (p - 1) * perPage

    const [items, total] = await Promise.all([
      Product.find(filter).sort(sortMap[sort] || sortMap.reco).skip(skip).limit(perPage),
      Product.countDocuments(filter),
    ])

    res.json({ items, page: p, limit: perPage, total })
  } catch (err) {
    next(err)
  }
})

// GET /api/products/:id
productsRouter.get('/:id', async (req, res, next) => {
  try {
    const item = await Product.findById(req.params.id)
    if (!item) return res.status(404).json({ error: { message: 'Product not found' } })
    res.json(item)
  } catch (err) {
    next(err)
  }
})

// POST /api/products (simple seed/create)
productsRouter.post('/', async (req, res, next) => {
  try {
    const created = await Product.create(req.body)
    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: created,
    })
  } catch (err) {
    next(err)
  }
})

// PUT /api/products/:id
productsRouter.put('/:id', async (req, res, next) => {
  try {
    console.log('PUT /api/products/%s request body:', req.params.id, req.body)
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!updated) {
      console.warn('Product update failed: not found', req.params.id)
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    console.log('Product update succeeded:', updated._id)
    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updated,
    })
  } catch (err) {
    console.error('Product update error:', err)
    next(err)
  }
})

// DELETE /api/products/:id
productsRouter.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id)
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      productId: deleted._id,
    })
  } catch (err) {
    next(err)
  }
})

module.exports = { productsRouter }

