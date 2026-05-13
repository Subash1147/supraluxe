const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    lastLogin: { type: Date },
  },
  { timestamps: true },
)

UserSchema.set('toJSON', {
  transform(doc, ret) {
    delete ret.password
    return ret
  },
})

const User = mongoose.model('User', UserSchema)

module.exports = { User }

