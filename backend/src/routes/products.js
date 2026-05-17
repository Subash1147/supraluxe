const express = require('express')
const multer = require('multer')
const { Product } = require('../models/Product')
const {
  productImageStorage,
  buildOptimizedCloudinaryUrl,
} = require('../server/cloudinary')

const upload = multer({
  storage: productImageStorage,
  limits: { fileSize: 5 * 1024 * 1024, files: 5 },
})

const productsRouter = express.Router()

function parseArrayField(field) {
  if (Array.isArray(field)) return field.filter(Boolean)
  if (typeof field !== 'string') return field ? [field] : []

  const trimmed = field.trim()
  if (!trimmed) return []

  if (/^[\[{]/.test(trimmed)) {
    try {
      const parsed = JSON.parse(trimmed)
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [String(parsed)]
    } catch (_err) {
      // fall through and parse as comma-separated list
    }
  }

  return trimmed.split(',').map((item) => item.trim()).filter(Boolean)
}

function parseNumber(value) {
  if (value === undefined || value === null || value === '') return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

function buildProductPayload(body, files) {
  const payload = {
    gender: body.gender,
    brand: body.brand,
    title: body.title,
    category: body.category,
    color: body.color,
    description: body.description,
  }

  const price = parseNumber(body.price)
  if (price !== undefined) payload.price = price

  const mrp = parseNumber(body.mrp)
  if (mrp !== undefined) payload.mrp = mrp

  const rating = parseNumber(body.rating)
  if (rating !== undefined) payload.rating = rating

  const tags = parseArrayField(body.tags)
  if (tags.length) payload.tags = tags

  const sizes = parseArrayField(body.sizes)
  if (sizes.length) payload.sizes = sizes

  const uploadedImages = Array.isArray(files) && files.length
    ? files.map((file) => buildOptimizedCloudinaryUrl(file.path)).filter(Boolean)
    : []

  if (uploadedImages.length) {
    payload.images = uploadedImages
  } else if (body.images !== undefined) {
    payload.images = parseArrayField(body.images)
  }

  return payload
}

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

// POST /api/products (create product with optional Cloudinary image upload)
productsRouter.post('/', upload.array('images', 5), async (req, res) => {
  try {
    const productData = buildProductPayload(req.body, req.files)
    console.log('POST /api/products request payload:', productData)

    const created = await Product.create(productData)
    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: created,
    })
  } catch (err) {
    console.error('Product create error:', err)
    return res.status(500).json({
      success: false,
      error: { message: err.message || 'Failed to create product' },
    })
  }
})

// PUT /api/products/:id (update product with optional Cloudinary image replacement)
productsRouter.put('/:id', upload.array('images', 5), async (req, res) => {
  try {
    const updateData = buildProductPayload(req.body, req.files)
    console.log('PUT /api/products/%s request payload:', req.params.id, updateData)

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })

    if (!updated) {
      console.warn('Product update failed: not found', req.params.id)
      return res.status(404).json({
        success: false,
        error: { message: 'Product not found' },
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
    return res.status(500).json({
      success: false,
      error: { message: err.message || 'Failed to update product' },
    })
  }
})

// DELETE /api/products/:id
productsRouter.delete('/:id', async (req, res) => {
  try {
    console.log('DELETE /api/products/%s request', req.params.id)
    const deleted = await Product.findByIdAndDelete(req.params.id)
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: { message: 'Product not found' },
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      productId: deleted._id,
    })
  } catch (err) {
    console.error('Product delete error:', err)
    return res.status(500).json({
      success: false,
      error: { message: err.message || 'Failed to delete product' },
    })
  }
})

module.exports = { productsRouter }

