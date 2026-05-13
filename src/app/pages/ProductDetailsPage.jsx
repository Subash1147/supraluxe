import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ChevronRight, ShieldCheck, Star, Truck } from 'lucide-react'
import { getReviewsByProductId } from '../data/reviews.js'
import { useCart } from '../state/CartContext.jsx'
import { useProducts } from '../state/ProductContext.jsx'
import { formatINR, percentOff } from '../utils/money.js'
import { ProductCard } from '../ui/ProductCard.jsx'
import { ProductImage } from '../ui/ProductImage.jsx'

export function ProductDetailsPage() {
  const { productId } = useParams()
  const { products, getProductById, fetchProductById, loading } = useProducts()
  const cart = useCart()
  const navigate = useNavigate()

  const [activeImg, setActiveImg] = useState(0)
  const [product, setProduct] = useState(() => getProductById(productId))
  const [size, setSize] = useState(product?.sizes?.[0] ?? null)
  const [qty, setQty] = useState(1)

  useEffect(() => {
    let isMounted = true
    const existing = getProductById(productId)
    if (existing) {
      setProduct(existing)
      setSize(existing.sizes?.[0] ?? null)
      return
    }

    fetchProductById(productId).then((item) => {
      if (!isMounted) return
      if (item) {
        setProduct(item)
        setSize(item.sizes?.[0] ?? null)
      }
    })

    return () => {
      isMounted = false
    }
  }, [productId, getProductById, fetchProductById])

  const off = product ? percentOff({ price: product.price, mrp: product.mrp }) : 0

  const similar = useMemo(() => {
    if (!product) return []
    return products
      .filter((p) => p.gender === product.gender && p.id !== product.id)
      .slice(0, 4)
  }, [product])

  const reviews = useMemo(() => {
    if (!product) return []
    return getReviewsByProductId(product.id)
  }, [product])

  const reviewSummary = useMemo(() => {
    if (!reviews.length) {
      return { avg: product?.rating || 0, count: 0, breakdown: {} }
    }
    const count = reviews.length
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / count
    const breakdown = reviews.reduce((acc, r) => {
      acc[r.rating] = (acc[r.rating] || 0) + 1
      return acc
    }, {})
    return { avg, count, breakdown }
  }, [product, reviews])

  if (!product) {
    if (loading) {
      return (
        <div className="rounded-3xl border border-zinc-200 bg-white p-10 text-center">
          <p className="text-base font-bold text-zinc-900">Loading product…</p>
          <p className="mt-2 text-sm text-zinc-600">Please wait while we load the latest product details.</p>
        </div>
      )
    }

    return (
      <div className="rounded-3xl border border-zinc-200 bg-white p-10 text-center">
        <p className="text-base font-bold text-zinc-900">Product not found</p>
        <p className="mt-2 text-sm text-zinc-600">
          The item you’re looking for doesn’t exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-zinc-950 px-5 text-sm font-semibold text-white hover:bg-zinc-800"
        >
          Back to Home
        </Link>
      </div>
    )
  }

  function addToCart() {
    cart.addItem({ productId: product.id, size, qty })
    navigate('/cart')
  }

  function submitReview(e) {
    e.preventDefault()
    alert('Demo reviews: connect your backend to save reviews.')
  }

  return (
    <div className="space-y-10">
      <nav className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
        <Link className="hover:text-zinc-900" to="/">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link className="hover:text-zinc-900" to={`/${product.gender}`}>
          {product.gender === 'men' ? 'Men' : 'Women'}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-zinc-700">{product.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white">
            <ProductImage
              src={product.images?.[activeImg]}
              alt={product.title}
              className="aspect-4/5 w-full object-cover"
            />
          </div>
          <div className="flex gap-3 overflow-auto pb-1">
            {product.images?.map((src, idx) => (
              <button
                key={src}
                type="button"
                onClick={() => setActiveImg(idx)}
                className={[
                  'shrink-0 overflow-hidden rounded-2xl border bg-white',
                  idx === activeImg ? 'border-zinc-950' : 'border-zinc-200',
                ].join(' ')}
                aria-label={`View image ${idx + 1}`}
              >
                <ProductImage
                  src={src}
                  alt=""
                  className="h-20 w-16 object-cover sm:h-24 sm:w-20"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-xs font-bold tracking-wide text-zinc-500">
              {product.brand}
            </p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-zinc-950 sm:text-3xl">
              {product.title}
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              Color: <span className="font-semibold text-zinc-900">{product.color}</span>{' '}
              • Rating: <span className="font-semibold text-zinc-900">{product.rating}</span>
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-5">
            <p className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
              <span className="text-2xl font-black text-zinc-950">
                {formatINR(product.price)}
              </span>
              {product.mrp && product.mrp > product.price ? (
                <>
                  <span className="text-sm text-zinc-500 line-through">
                    {formatINR(product.mrp)}
                  </span>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    {off}% OFF
                  </span>
                </>
              ) : null}
            </p>
            <p className="mt-2 text-xs text-zinc-600">
              Inclusive of all taxes • Extra offers may apply at checkout
            </p>

            <div className="mt-5">
              <p className="text-sm font-bold text-zinc-900">Select size</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes?.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={[
                      'h-10 rounded-xl border px-4 text-sm font-semibold',
                      size === s
                        ? 'border-zinc-950 bg-zinc-950 text-white'
                        : 'border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50',
                    ].join(' ')}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="flex items-center overflow-hidden rounded-xl border border-zinc-200 bg-white">
                <button
                  type="button"
                  className="h-11 w-11 text-lg font-bold text-zinc-700 hover:bg-zinc-50"
                  onClick={() => setQty((x) => Math.max(1, x - 1))}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <div className="h-11 w-12 text-center text-sm font-bold leading-11 text-zinc-900">
                  {qty}
                </div>
                <button
                  type="button"
                  className="h-11 w-11 text-lg font-bold text-zinc-700 hover:bg-zinc-50"
                  onClick={() => setQty((x) => x + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={addToCart}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-zinc-950 px-5 text-sm font-semibold text-white hover:bg-zinc-800"
              >
                Add to Cart
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-4">
              <Truck className="mt-0.5 h-5 w-5 text-zinc-700" />
              <div>
                <p className="text-sm font-bold text-zinc-900">Fast delivery</p>
                <p className="mt-1 text-xs text-zinc-600">
                  Typically ships within 24 hours.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-zinc-700" />
              <div>
                <p className="text-sm font-bold text-zinc-900">Secure payments</p>
                <p className="mt-1 text-xs text-zinc-600">
                  UPI, cards, wallets & netbanking.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-5">
            <p className="text-sm font-bold text-zinc-900">Product details</p>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600">
              <li>Clean minimal design with premium fabric feel.</li>
              <li>Designed for comfort and everyday styling.</li>
              <li>Care: Gentle wash, low heat iron.</li>
            </ul>
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-xl font-black tracking-tight text-zinc-950 sm:text-2xl">
            Reviews
          </h2>
          <button
            type="button"
            className="text-sm font-semibold text-zinc-700 hover:text-zinc-950"
            onClick={() => alert('Demo: open review modal here.')}
          >
            Write a review
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-3xl border border-zinc-200 bg-white p-5">
            <p className="text-sm font-bold text-zinc-900">Overall rating</p>
            <div className="mt-4 flex items-end gap-3">
              <p className="text-4xl font-black tracking-tight text-zinc-950">
                {reviewSummary.avg ? reviewSummary.avg.toFixed(1) : product.rating}
              </p>
              <div className="pb-1">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={[
                        'h-4 w-4',
                        idx < Math.round(reviewSummary.avg || product.rating)
                          ? 'fill-amber-400 text-amber-500'
                          : 'text-zinc-300',
                      ].join(' ')}
                    />
                  ))}
                </div>
                <p className="mt-1 text-xs text-zinc-600">
                  {reviewSummary.count
                    ? `${reviewSummary.count} reviews`
                    : 'No reviews yet (demo)'}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              {[5, 4, 3, 2, 1].map((r) => {
                const count = reviewSummary.breakdown[r] || 0
                const pct = reviewSummary.count ? (count / reviewSummary.count) * 100 : 0
                return (
                  <div key={r} className="flex items-center gap-3">
                    <p className="w-10 text-xs font-semibold text-zinc-700">{r}★</p>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100">
                      <div
                        className="h-full rounded-full bg-zinc-950"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="w-8 text-right text-xs text-zinc-600">{count}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-5 lg:col-span-2">
            {reviews.length ? (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-2xl border border-zinc-200 bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-zinc-900">{r.title}</p>
                        <div className="mt-1 flex items-center gap-2 text-xs text-zinc-600">
                          <span className="font-semibold text-zinc-800">{r.name}</span>
                          <span>•</span>
                          <span>{r.date}</span>
                          {r.verified ? (
                            <>
                              <span>•</span>
                              <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700">
                                Verified purchase
                              </span>
                            </>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            className={[
                              'h-4 w-4',
                              idx < r.rating
                                ? 'fill-amber-400 text-amber-500'
                                : 'text-zinc-300',
                            ].join(' ')}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-zinc-700">{r.body}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-center">
                <p className="text-sm font-bold text-zinc-900">No reviews yet</p>
                <p className="mt-2 text-sm text-zinc-600">
                  Be the first to review this product (demo UI).
                </p>
              </div>
            )}

            <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-sm font-bold text-zinc-900">Quick review</p>
              <form className="mt-3 grid gap-3 sm:grid-cols-2" onSubmit={submitReview}>
                <label className="block sm:col-span-1">
                  <span className="text-xs font-semibold text-zinc-700">Name</span>
                  <input
                    required
                    className="mt-1 h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-400"
                    placeholder="Your name"
                  />
                </label>
                <label className="block sm:col-span-1">
                  <span className="text-xs font-semibold text-zinc-700">Rating</span>
                  <select className="mt-1 h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm font-semibold outline-none focus:border-zinc-400">
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Good</option>
                    <option value="3">3 - Okay</option>
                    <option value="2">2 - Bad</option>
                    <option value="1">1 - Poor</option>
                  </select>
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-xs font-semibold text-zinc-700">Comment</span>
                  <textarea
                    required
                    className="mt-1 min-h-24 w-full resize-y rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400"
                    placeholder="Share your thoughts…"
                  />
                </label>
                <div className="sm:col-span-2 flex items-center justify-end">
                  <button
                    type="submit"
                    className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-950 px-4 text-sm font-semibold text-white hover:bg-zinc-800"
                  >
                    Submit (demo)
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {similar.length ? (
        <section className="space-y-4">
          <div className="flex items-end justify-between gap-3">
            <h2 className="text-xl font-black tracking-tight text-zinc-950 sm:text-2xl">
              You may also like
            </h2>
            <Link
              to={`/${product.gender}`}
              className="text-sm font-semibold text-zinc-700 hover:text-zinc-950"
            >
              View more
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}

