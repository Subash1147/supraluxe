import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../state/CartContext.jsx'
import { useAuth } from '../state/AuthContext.jsx'
import { useProducts } from '../state/ProductContext.jsx'
import { Payment } from '../ui/Payment.jsx'
import { ShoppingBag, AlertCircle, Loader } from 'lucide-react'
import { ProductImage } from '../ui/ProductImage.jsx'
import { apiPost } from '../../utils/api.js'

export function CheckoutPage() {
  const navigate = useNavigate()
  const cart = useCart()
  const { user } = useAuth()
  const { products } = useProducts()
  const [orderId, setOrderId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
  })

  // Enrich cart items with product details
  const cartLines = useMemo(() => {
    return cart.items
      .map((i) => {
        const p = products.find((product) => String(product.id) === String(i.productId))
        if (!p) return null
        return {
          key: `${i.productId}:${i.size ?? ''}`,
          item: i,
          product: p,
          lineTotal: p.price * i.qty,
        }
      })
      .filter(Boolean)
  }, [cart.items, products])

  const subtotal = cartLines.reduce((sum, l) => sum + l.lineTotal, 0)
  const shipping = subtotal > 500 ? 0 : 50
  const total = subtotal + shipping

  // Auth and cart checks
  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
  }, [user, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }))
    setFieldErrors((prev) => ({
      ...prev,
      [name]: '',
    }))
  }

  const fieldClass = (field) =>
    fieldErrors[field]
      ? 'border-red-400 focus:ring-red-400'
      : 'border-zinc-200 focus:ring-zinc-950'

  const requiredFields = ['name', 'email', 'phone', 'address', 'city', 'postalCode']
  const isFormValid = requiredFields.every((field) => shippingAddress[field]?.trim())

  const handlePlaceOrder = async () => {
    setLoading(true)
    setPaymentError('')
    setFieldErrors({})

    const newErrors = {}
    requiredFields.forEach((field) => {
      if (!shippingAddress[field]?.trim()) {
        newErrors[field] = 'This field is required'
      }
    })

    if (shippingAddress.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingAddress.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors)
      setPaymentError('Please fill in all required shipping address fields.')
      setLoading(false)
      return
    }

    try {
      const orderData = {
        userId: user?.id || user?.uid || null,
        items: cartLines.map((line) => ({
          productId: line.product.id,
          title: line.product.title,
          price: line.product.price,
          qty: line.item.qty,
          size: line.item.size,
          image: line.product.images?.[0],
        })),
        total,
        shippingAddress,
        customerName: shippingAddress.name,
        customerEmail: shippingAddress.email,
      }

      console.log('Creating order payload:', orderData)

      const result = await apiPost('/api/orders', orderData)
      console.log('Order response:', result)
      setOrderId(result._id || result.id)
    } catch (error) {
      console.error('Order creation error:', error)
      setPaymentError(error.message || 'Failed to create order')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = (data) => {
    setPaymentSuccess(true)
    setPaymentError('')
    // Redirect to order confirmation after a delay
    setTimeout(() => {
      if (orderId) {
        cart.clear()
        navigate(`/order-confirmation/${orderId}`)
      }
    }, 2000)
  }

  const handlePaymentError = (error) => {
    setPaymentError(error)
    setPaymentSuccess(false)
  }

  // Loading state
  if (!user) {
    return (
      <div className="container-pad py-12">
        <div className="mx-auto max-w-2xl rounded-3xl border border-zinc-200 bg-white p-8 text-center">
          <Loader className="mx-auto h-12 w-12 animate-spin text-zinc-400" />
          <p className="mt-4 text-zinc-600">Loading checkout...</p>
        </div>
      </div>
    )
  }

  // Empty cart state
  if (cartLines.length === 0) {
    return (
      <div className="container-pad py-12">
        <div className="mx-auto max-w-2xl rounded-3xl border border-zinc-200 bg-white p-8 text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-zinc-400" />
          <h2 className="mt-4 text-xl font-bold text-zinc-950">Your cart is empty</h2>
          <p className="mt-2 text-zinc-600">Add items before checking out</p>
          <button
            onClick={() => navigate('/products')}
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-zinc-950 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container-pad py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black mb-2 text-zinc-950">Checkout</h1>
        <p className="text-zinc-600 mb-8">Review your order and complete payment</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Items */}
            <div className="rounded-3xl border border-zinc-200 bg-white p-6">
              <h2 className="text-lg font-bold text-zinc-950 mb-4">Order Items</h2>
              <div className="space-y-4">
                {cartLines.map((line) => (
                  <div key={line.key} className="flex gap-4 pb-4 border-b border-zinc-200 last:border-0">
                    <div className="h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                      <ProductImage
                        src={line.product.images?.[0]}
                        alt={line.product.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-zinc-500 uppercase">{line.product.brand}</p>
                      <p className="font-semibold text-zinc-950 line-clamp-2">{line.product.title}</p>
                      <div className="mt-2 flex items-center gap-3 text-sm text-zinc-600">
                        <span>Qty: {line.item.qty}</span>
                        {line.item.size && <span>Size: {line.item.size}</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-zinc-950">₹{line.lineTotal.toLocaleString('en-IN')}</p>
                      <p className="text-xs text-zinc-500">₹{line.product.price}/each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="rounded-3xl border border-zinc-200 bg-white p-6">
              <h2 className="text-lg font-bold text-zinc-950 mb-4">Shipping Address</h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-zinc-950 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      value={shippingAddress.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${fieldClass('name')}`}
                    />
                    {fieldErrors.name && <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-zinc-950 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      value={shippingAddress.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${fieldClass('email')}`}
                    />
                    {fieldErrors.email && <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-950 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91 9876543210"
                    value={shippingAddress.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${fieldClass('phone')}`}
                  />
                  {fieldErrors.phone && <p className="mt-1 text-sm text-red-600">{fieldErrors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-950 mb-2">Address</label>
                  <textarea
                    name="address"
                    placeholder="123 Main Street"
                    value={shippingAddress.address}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${fieldClass('address')}`}
                    rows="3"
                  />
                  {fieldErrors.address && <p className="mt-1 text-sm text-red-600">{fieldErrors.address}</p>}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-zinc-950 mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      placeholder="Mumbai"
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${fieldClass('city')}`}
                    />
                    {fieldErrors.city && <p className="mt-1 text-sm text-red-600">{fieldErrors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-zinc-950 mb-2">State</label>
                    <input
                      type="text"
                      name="state"
                      placeholder="Maharashtra"
                      value={shippingAddress.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-950"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-zinc-950 mb-2">Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      placeholder="400001"
                      value={shippingAddress.postalCode}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${fieldClass('postalCode')}`}
                    />
                    {fieldErrors.postalCode && <p className="mt-1 text-sm text-red-600">{fieldErrors.postalCode}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Total & Payment - Right Column */}
          <div className="space-y-6">
            {/* Price Summary */}
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 sticky top-20">
              <h2 className="text-lg font-bold text-zinc-950 mb-4">Order Summary</h2>
              <div className="space-y-3 pb-4 border-b border-zinc-200">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600">Subtotal</span>
                  <span className="font-semibold text-zinc-950">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600">Shipping</span>
                  <span className="font-semibold text-zinc-950">
                    {shipping === 0 ? 'Free' : `₹${shipping.toLocaleString('en-IN')}`}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 mb-6">
                <span className="text-lg font-bold text-zinc-950">Total</span>
                <span className="text-2xl font-black text-zinc-950">₹{total.toLocaleString('en-IN')}</span>
              </div>

              {paymentError && (
                <div className="mb-4 flex gap-3 rounded-lg bg-red-50 border border-red-200 p-3">
                  <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-red-700">{paymentError}</div>
                </div>
              )}

              {paymentSuccess && (
                <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700">
                  Payment successful! Redirecting...
                </div>
              )}

              {!orderId ? (
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading || !isFormValid}
                  className="w-full py-3 px-4 rounded-lg font-bold text-white bg-zinc-950 hover:bg-zinc-800 disabled:bg-zinc-400 transition"
                >
                  {loading ? 'Creating Order...' : 'Place Order'}
                </button>
              ) : (
                <Payment orderId={orderId} amount={total} onSuccess={handlePaymentSuccess} onError={handlePaymentError} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}