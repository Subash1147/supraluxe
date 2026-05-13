const { Product } = require('../models/Product')

async function seedProducts(products) {
  if (!Array.isArray(products) || !products.length) return { inserted: 0 }
  const inserted = await Product.insertMany(products, { ordered: false })
  return { inserted: inserted.length }
}

module.exports = { seedProducts }

