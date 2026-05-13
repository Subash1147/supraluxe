import { Link } from 'react-router-dom'
import { Heart, ShoppingBag } from 'lucide-react'
import { useCart } from '../state/CartContext.jsx'
import { useWishlist } from '../state/WishlistContext.jsx'
import { useProducts } from '../state/ProductContext.jsx'
import { formatINR, percentOff } from '../utils/money.js'
import { ProductImage } from '../ui/ProductImage.jsx'

export function WishlistPage() {
  const wishlist = useWishlist()
  const cart = useCart()
  const { products, loading } = useProducts()
  const items = wishlist.items
    .map((id) => products.find((product) => String(product.id) === String(id)))
    .filter(Boolean)

  return (
    <div className="space-y-8">
      <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-[0_4px_30px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.36em] text-slate-600">Saved for later</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-black">Your Wishlist</h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-black shadow-inner">
            <Heart className="h-4 w-4 text-red-500" />
            {wishlist.count()} items
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
          Keep your favorite luxury pieces in one place. Move them to cart when you’re ready to checkout.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-4xl border border-slate-200 bg-slate-50 p-10 text-center shadow-sm">
          <p className="text-xl font-black text-black">Your wishlist is empty</p>
          <p className="mt-3 max-w-xl mx-auto text-sm text-slate-600">
            Discover premium streetwear and save pieces that match your mood.
          </p>
          <Link
            to="/products"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-black px-6 text-sm font-semibold text-white transition hover:bg-slate-900"
          >
            Browse latest drops
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-3">
          {items.map((product) => {
            const off = percentOff({ price: product.price, mrp: product.mrp })
            return (
              <div
                key={product.id}
                className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950 p-5 shadow-xl"
              >
                <div className="relative overflow-hidden rounded-3xl bg-slate-900">
                  <ProductImage
                    src={product.images?.[0]}
                    alt={product.title}
                    className="h-72 w-full object-cover transition duration-500 hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-300">
                        {product.brand}
                      </p>
                      <p className="mt-2 text-lg font-black text-white">{product.title}</p>
                    </div>
                    <Heart className="h-5 w-5 text-gold-300" />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-luxury-200">
                    <span>{formatINR(product.price)}</span>
                    {product.mrp && product.mrp > product.price ? (
                      <span className="line-through text-slate-500">{formatINR(product.mrp)}</span>
                    ) : null}
                    {off ? <span className="text-gold-300">{off}% off</span> : null}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => cart.addItem({ productId: product.id, size: product.sizes?.[0] ?? null, qty: 1 })}
                      className="inline-flex h-12 items-center justify-center rounded-2xl bg-gold-500 text-sm font-semibold text-charcoal transition hover:bg-gold-400"
                    >
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Add to cart
                    </button>
                    <Link
                      to={`/product/${product.id}`}
                      className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/10 text-sm font-semibold text-white transition hover:border-gold-400 hover:text-gold-300"
                    >
                      View details
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
