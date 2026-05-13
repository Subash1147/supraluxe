import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useWishlist } from '../state/WishlistContext.jsx'
import { formatINR, percentOff } from '../utils/money.js'
import { ProductImage } from './ProductImage.jsx'

export function ProductCard({ product }) {
  const off = percentOff({ price: product.price, mrp: product.mrp })
  const wishlist = useWishlist()
  const isSaved = wishlist.hasItem(product.id)

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
    >
      <Link
        to={`/product/${product.id}`}
        className="block"
      >
        <div className="relative aspect-4/5 overflow-hidden bg-slate-100">
          <ProductImage
            src={product.images?.[0]}
            alt={product.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
          {product.tags?.[0] ? (
            <span className="absolute left-3 top-3 rounded-full bg-black/10 px-3 py-1 text-[11px] font-bold tracking-wide text-black shadow">
              {product.tags[0]}
            </span>
          ) : null}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              wishlist.toggleItem(product.id)
            }}
            className={`absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white/80 text-black backdrop-blur-sm transition ${
              isSaved
                ? 'border-black bg-black text-white'
                : 'border-slate-300 hover:border-black hover:bg-white'
            }`}
            aria-label={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className="h-4 w-4" />
          </button>
        </div>

        <div className="p-4 pt-0">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-600">
            {product.brand}
          </p>
          <p className="mt-1 line-clamp-2 text-sm font-semibold text-black">
            {product.title}
          </p>
          <p className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-sm font-bold text-black">
              {formatINR(product.price)}
            </span>
            {product.mrp && product.mrp > product.price ? (
              <>
                <span className="text-xs text-slate-500 line-through">
                  {formatINR(product.mrp)}
                </span>
                <span className="text-xs font-bold text-amber-600">{off}% OFF</span>
              </>
            ) : null}
          </p>
          <p className="mt-2 text-xs text-slate-600">{product.color}</p>
        </div>
      </Link>
    </motion.div>
  )
}

