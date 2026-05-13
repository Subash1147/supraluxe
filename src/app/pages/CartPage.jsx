import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { useCart } from '../state/CartContext.jsx'
import { useProducts } from '../state/ProductContext.jsx'
import { formatINR } from '../utils/money.js'
import { ProductImage } from '../ui/ProductImage.jsx'

export function CartPage() {
  const cart = useCart()
  const { products, loading } = useProducts()

  const lines = cart.items
    .map((i) => {
      const p = products.find((product) => String(product.id) === String(i.productId))
      if (!p) return null
      return {
        key: `${i.productId}:${i.size ?? ''}`,
        item: i,
        product: p,
        lineTotal: p.price * i.qty,
        lineMrp: (p.mrp || p.price) * i.qty,
      }
    })
    .filter(Boolean)

  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0)
  const mrpTotal = lines.reduce((sum, l) => sum + l.lineMrp, 0)
  const discount = Math.max(0, mrpTotal - subtotal)
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 99
  const grandTotal = subtotal + shipping

  if (!lines.length) {
    return (
      <div className="rounded-3xl border border-white/10 bg-black p-10 text-center">
        <p className="text-base font-black text-white">Your cart is empty</p>
        <p className="mt-3 text-sm text-slate-300">
          Add something you love and it’ll show up here.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/women"
            className="inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-slate-200"
          >
            Shop Women
          </Link>
          <Link
            to="/men"
            className="inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-slate-200"
          >
            Shop Men
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <h1 className="text-2xl font-black tracking-tight text-black sm:text-3xl">
          Cart
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Review items and proceed to checkout.
        </p>

        <div className="mt-6 space-y-4">
          {lines.map((l) => (
            <div
              key={l.key}
              className="flex gap-4 rounded-3xl border border-slate-200 bg-white p-4"
            >
              <Link
                to={`/product/${l.product.id}`}
                className="h-24 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-100 sm:h-28 sm:w-24"
              >
                <ProductImage
                  src={l.product.images?.[0]}
                  alt={l.product.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </Link>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold tracking-wide text-slate-700">
                      {l.product.brand}
                    </p>
                    <Link
                      to={`/product/${l.product.id}`}
                      className="mt-1 line-clamp-2 text-sm font-semibold text-black hover:underline"
                    >
                      {l.product.title}
                    </Link>
                    <p className="mt-2 text-xs text-slate-600">
                      Size: <span className="font-semibold">{l.item.size ?? '—'}</span> •{' '}
                      Color: <span className="font-semibold">{l.product.color}</span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      cart.removeItem({ productId: l.item.productId, size: l.item.size })
                    }
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 text-black hover:bg-slate-100"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center overflow-hidden rounded-xl border border-slate-300 bg-white">
                    <button
                      type="button"
                      className="h-10 w-10 text-lg font-bold text-black hover:bg-slate-100"
                      onClick={() =>
                        cart.setQty({
                          productId: l.item.productId,
                          size: l.item.size,
                          qty: Math.max(1, l.item.qty - 1),
                        })
                      }
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <div className="h-10 w-10 text-center text-sm font-bold leading-10 text-black">
                      {l.item.qty}
                    </div>
                    <button
                      type="button"
                      className="h-10 w-10 text-lg font-bold text-black hover:bg-slate-100"
                      onClick={() =>
                        cart.setQty({
                          productId: l.item.productId,
                          size: l.item.size,
                          qty: l.item.qty + 1,
                        })
                      }
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <p className="text-sm font-black text-black">
                    {formatINR(l.lineTotal)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/women"
            className="text-sm font-semibold text-slate-700 hover:text-black"
          >
            ← Continue shopping
          </Link>
          <button
            type="button"
            onClick={() => cart.clear()}
            className="text-sm font-semibold text-slate-700 hover:text-black"
          >
            Clear cart
          </button>
        </div>
      </div>

      <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-5 lg:sticky lg:top-28">
        <p className="text-sm font-black text-black">Order summary</p>
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between text-slate-600">
            <span>Subtotal</span>
            <span className="font-semibold text-black">{formatINR(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span>Discount</span>
            <span className="font-semibold text-green-600">
              − {formatINR(discount)}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span>Shipping</span>
            <span className="font-semibold text-black">
              {shipping === 0 ? 'Free' : formatINR(shipping)}
            </span>
          </div>
          <div className="h-px bg-slate-200" />
          <div className="flex items-center justify-between">
            <span className="font-bold text-black">Total</span>
            <span className="text-lg font-black text-black">
              {formatINR(grandTotal)}
            </span>
          </div>
        </div>

        <Link
          to="/checkout"
          className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-xl bg-black px-5 text-sm font-semibold text-white hover:bg-slate-900"
        >
          Checkout
        </Link>

        <p className="mt-3 text-xs text-slate-600">
          Tip: Add ₹{Math.max(0, 999 - subtotal)} more for free shipping.
        </p>
      </aside>
    </div>
  )
}

