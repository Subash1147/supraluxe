const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema(
  {
    gender: { type: String, enum: ['men', 'women'], required: true, index: true },
    brand: { type: String, required: true, trim: true, index: true },
    title: { type: String, required: true, trim: true, index: true },
    category: { type: String, default: '', trim: true, index: true },
    color: { type: String, default: '', trim: true },
    price: { type: Number, required: true, min: 0, index: true },
    mrp: { type: Number, min: 0 },
    rating: { type: Number, min: 0, max: 5, default: 0, index: true },
    tags: { type: [String], default: [] },
    sizes: { type: [String], default: [] },
    images: { type: [String], default: [] },
    description: { type: String, default: '' },
  },
  { timestamps: true },
)

ProductSchema.index({ title: 'text', brand: 'text', color: 'text' })

ProductSchema.virtual('id').get(function () {
  return this._id.toString()
})

ProductSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
})

ProductSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
})

const Product = mongoose.model('Product', ProductSchema)

module.exports = { Product }

