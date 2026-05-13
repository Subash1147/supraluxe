import { Link } from 'react-router-dom'
import { Heart, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCart } from '../state/CartContext.jsx'
import { useWishlist } from '../state/WishlistContext.jsx'
import { formatINR, percentOff } from '../utils/money.js'
import { ProductImage } from './ProductImage.jsx'

const badgeStyles = {
  New: 'bg-slate-100 text-black border border-slate-300',
  Bestseller: 'bg-white text-black border border-slate-300',
  'Hot Deal': 'bg-black text-white border border-black',
}

export function ProductCardWhite({ product }) {
  const cart = useCart()
  const wishlist = useWishlist()
  const off = percentOff({ price: product.price, mrp: product.mrp })
  const saved = wishlist.hasItem(product.id)

  function add(e) {
    e.preventDefault()
    e.stopPropagation()
    cart.addItem({ productId: product.id, size: product.sizes?.[0] ?? null, qty: 1 })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: 'easeOut' }}
      whileHover={{ y: -8, scale: 1.02, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.12)" }}
      className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition duration-300 ease-out"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-slate-100">
          <ProductImage
            src={product.images?.[0]}
            alt={product.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent" />

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              wishlist.toggleItem(product.id)
            }}
            className={`absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border bg-white/80 text-black backdrop-blur-sm shadow-[0_4px_12px_rgba(0,0,0,0.10)] transition ${
              saved
                ? 'border-black bg-black text-white'
                : 'border-slate-300 hover:border-black hover:bg-white'
            }`}
            aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className="h-5 w-5" />
          </button>

          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {product.tags?.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] shadow-[0_2px_8px_rgba(0,0,0,0.08)] ${
                  badgeStyles[tag] ?? 'bg-slate-100 text-black border border-slate-300'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-600">
            {product.brand}
          </p>
          <h2 className="mt-3 min-h-[3rem] text-lg font-bold leading-tight text-black line-clamp-2">
            {product.title}
          </h2>

          <div className="mt-4 flex flex-wrap items-end gap-3">
            <p className="text-base font-black text-black">
              {formatINR(product.price)}
            </p>
            {product.mrp && product.mrp > product.price && (
              <p className="text-sm text-slate-500 line-through">
                {formatINR(product.mrp)}
              </p>
            )}
          </div>

          <p className="mt-3 text-sm text-slate-600">{product.color}</p>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={add}
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-black px-4 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition hover:bg-slate-900 active:scale-95"
              aria-label="Add to cart"
            >
              Add to cart
            </button>
            <div className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.26em] text-slate-700">
              <Star className="h-4 w-4 text-amber-500" />
              {product.rating}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
