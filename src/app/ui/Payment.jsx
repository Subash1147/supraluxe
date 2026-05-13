import { useState } from 'react'
import { useCart } from '../state/CartContext.jsx'
import { useAuth } from '../state/AuthContext.jsx'
import { apiPost } from '../../utils/api.js'

export function Payment({ orderId, amount, onSuccess, onError }) {
  const { user } = useAuth()
  const cart = useCart()
  const [loading, setLoading] = useState(false)

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    setLoading(true)

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        onError('Razorpay SDK failed to load')
        setLoading(false)
        return
      }

      // Create order on backend
      const orderData = await apiPost('/api/payments/create-order', {
        amount: amount,
        orderId: orderId
      })

      // Razorpay options
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Supraluxe',
        description: 'Purchase from Supraluxe',
        order_id: orderData.orderId,
        handler: async function (response) {
          // Verify payment on backend
          try {
            const verifyData = await apiPost('/api/payments/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderId
            })

            if (verifyData.success) {
              // Clear cart after successful payment
              cart.clear()
              onSuccess(verifyData)
            } else {
              onError('Payment verification failed')
            }
          } catch (error) {
            console.error('Payment verification error:', error)
            onError('Payment verification failed')
          }
        },
        prefill: {
          name: user?.displayName || user?.email?.split('@')[0] || '',
          email: user?.email || '',
          contact: '',
        },
        theme: {
          color: '#b89456', // Gold color matching Supraluxe luxury theme
        },
        modal: {
          ondismiss: function() {
            setLoading(false)
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()

    } catch (error) {
      console.error('Payment error:', error)
      onError(error.message || 'Payment failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
        loading
          ? 'bg-slate-600 cursor-not-allowed text-white'
          : 'bg-gold-500 text-charcoal hover:bg-gold-400'
      }`}
    >
      {loading ? 'Processing...' : `Pay ₹${amount}`}
    </button>
  )
}