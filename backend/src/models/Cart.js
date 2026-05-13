const mongoose = require('mongoose')

const CartItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    size: { type: String, default: null },
    qty: { type: Number, required: true, min: 1, default: 1 },
  },
  { _id: false },
)

const CartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: { type: [CartItemSchema], default: [] },
  },
  { timestamps: true },
)

const Cart = mongoose.model('Cart', CartSchema)

module.exports = { Cart }

