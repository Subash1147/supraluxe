(async () => {
  try {
    const orderResp = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ productId: '000000000000000000000000', title: 'Test Item', price: 100, qty: 1, size: 'M' }],
        total: 100,
        shippingAddress: {
          name: 'Test User',
          email: 'test@example.com',
          phone: '9999999999',
          address: '123 Test St',
          city: 'Test City',
          state: 'Test State',
          zip: '123456'
        }
      })
    })
    const orderData = await orderResp.json()
    console.log('ORDER_RESPONSE', orderResp.status, JSON.stringify(orderData))
    if (!orderData._id) return

    const paymentResp = await fetch('http://localhost:5000/api/payments/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 100, orderId: orderData._id })
    })
    const paymentData = await paymentResp.json()
    console.log('PAYMENT_RESPONSE', paymentResp.status, JSON.stringify(paymentData))
  } catch (err) {
    console.error(err)
  }
})();
