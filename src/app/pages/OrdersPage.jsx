import { Link } from 'react-router-dom'

export function OrdersPage() {
  return (
    <div className="container-pad py-8">
      <h1 className="text-2xl font-black text-black">My Orders</h1>
      <p className="mt-4 text-slate-600">Your order history will appear here.</p>
      <Link
        to="/products"
        className="mt-6 inline-flex h-11 items-center justify-center rounded-2xl bg-black px-5 text-sm font-semibold text-white hover:bg-slate-900"
      >
        Continue Shopping
      </Link>
    </div>
  )
}