const express = require('express')
const Razorpay = require('razorpay')
const crypto = require('crypto')
const { Order } = require('../models/Order')

const router = express.Router()

// Initialize Razorpay
let razorpay = null
try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  }
} catch (error) {
  console.warn('Razorpay not configured:', error.message)
}

// Create Razorpay order
router.post('/create-order', async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({
        error: { message: 'Payment gateway not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env' }
      })
    }

    const { amount, currency = 'INR', orderId } = req.body

    // Validate required fields
    if (!amount || !orderId) {
      return res.status(400).json({
        error: { message: 'Amount and orderId are required' }
      })
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Razorpay expects amount in paisa
      currency,
      receipt: `order_${orderId}`,
      payment_capture: 1, // Auto capture payment
    }

    const razorpayOrder = await razorpay.orders.create(options)

    // Update order with Razorpay order ID
    await Order.findByIdAndUpdate(orderId, {
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: 'pending'
    })

    res.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID
    })
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    res.status(500).json({
      error: { message: 'Failed to create payment order' }
    })
  }
})

// Verify payment
router.post('/verify-payment', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    } = req.body

    // Create expected signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex')

    // Verify signature
    if (razorpay_signature === expectedSign) {
      // Payment verified successfully
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'paid',
        razorpayPaymentId: razorpay_payment_id,
        status: 'processing' // Update order status to processing
      })

      res.json({
        success: true,
        message: 'Payment verified successfully',
        paymentId: razorpay_payment_id
      })
    } else {
      // Payment verification failed
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'failed'
      })

      res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      })
    }
  } catch (error) {
    console.error('Error verifying payment:', error)
    res.status(500).json({
      error: { message: 'Payment verification error' }
    })
  }
})

// Get payment status
router.get('/payment-status/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
    if (!order) {
      return res.status(404).json({
        error: { message: 'Order not found' }
      })
    }

    res.json({
      paymentStatus: order.paymentStatus,
      razorpayPaymentId: order.razorpayPaymentId,
      razorpayOrderId: order.razorpayOrderId
    })
  } catch (error) {
    console.error('Error fetching payment status:', error)
    res.status(500).json({
      error: { message: 'Failed to fetch payment status' }
    })
  }
})

module.exports = { paymentsRouter: router }