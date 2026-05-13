import { Link } from 'react-router-dom'
import { CategoryCard } from '../ui/CategoryCard.jsx'
import { ProductCard } from '../ui/ProductCard.jsx'
import { useProducts } from '../state/ProductContext.jsx'

export function HomePage() {
  const { products, loading } = useProducts()
  const trending = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 8)

  return (
    <div className="space-y-10 sm:space-y-14">
      <section className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-[0_4px_30px_rgba(0,0,0,0.08)]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at top left, rgba(0,0,0,0.02), transparent 20%), radial-gradient(circle at bottom right, rgba(0,0,0,0.02), transparent 20%)',
          }}
        />
        <div className="absolute left-1/2 top-0 h-64 w-96 -translate-x-1/2 rounded-full bg-black/5 blur-3xl" />
        <div className="relative grid gap-8 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:px-14 lg:py-16">
          <div className="max-w-2xl space-y-6">
            <span className="inline-flex items-center rounded-full border border-slate-300 bg-slate-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.34em] text-slate-700">
              Spring 2026 • New Drop
            </span>
            <h1 className="text-4xl font-black tracking-tight text-black sm:text-5xl lg:text-6xl">
              SUPRA LUXE
              <span className="block text-slate-600">High-end streetwear for the modern icon.</span>
            </h1>
            <p className="max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
              Discover premium silhouettes, luxe textures and cinematic details crafted for a refined urban wardrobe. Every piece is designed to feel bold, polished and effortlessly elevated.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/men"
                className="inline-flex h-12 items-center justify-center rounded-full border border-black bg-black px-6 text-sm font-semibold text-white transition hover:bg-slate-900"
              >
                Explore Menswear
              </Link>
              <Link
                to="/women"
                className="inline-flex h-12 items-center justify-center rounded-full border border-slate-300 bg-white px-6 text-sm font-semibold text-black transition hover:bg-slate-50"
              >
                View Collection
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-center backdrop-blur">
                <p className="text-2xl font-black text-black">120+</p>
                <p className="text-[11px] uppercase tracking-[0.24em] text-slate-600">Exclusive styles</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-center backdrop-blur">
                <p className="text-2xl font-black text-black">48h</p>
                <p className="text-[11px] uppercase tracking-[0.24em] text-slate-600">Rush delivery</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-center backdrop-blur">
                <p className="text-2xl font-black text-black">24/7</p>
                <p className="text-[11px] uppercase tracking-[0.24em] text-slate-600">Concierge support</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-4xl border border-slate-200 bg-slate-50 shadow-lg">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'linear-gradient(180deg, rgba(255,255,255,0.4), rgba(255,255,255,0.1) 45%, transparent 100%)',
              }}
            />
            <img
              src="https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1200&q=80"
              alt="Luxury model in cinematic lighting"
              className="w-full object-cover"
              style={{ height: '520px' }}
              loading="lazy"
            />
            <div className="absolute bottom-6 left-6 right-6 rounded-[1.75rem] border border-slate-300 bg-white/95 p-5 backdrop-blur sm:left-auto sm:right-auto sm:w-[calc(100%-3rem)] lg:w-[92%]">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-700">Premium collection</p>
                  <p className="mt-1 text-lg font-semibold tracking-tight text-black">Midnight Architect Jacket</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-700">
                  <span className="h-2 w-2 rounded-full bg-black" />Limited edition
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.36em] text-slate-600">Select categories</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-black sm:text-4xl">Refined edits by category</h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Navigate luxury streetwear, accessories and limited drops with polished category previews that feel editorial and functional.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <CategoryCard
            title="Menswear"
            subtitle="Sharp cuts & refined layers"
            to="/men"
            image="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80"
          />
          <CategoryCard
            title="Women"
            subtitle="Unexpected silhouettes"
            to="/women"
            image="https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1200&q=80"
          />
          <CategoryCard
            title="Accessories"
            subtitle="Statement accents"
            to="/products?q=accessories"
            image="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80"
          />
          <CategoryCard
            title="New Arrivals"
            subtitle="Drop-ready essentials"
            to="/women?q=new"
            image="https://images.unsplash.com/photo-1520975896974-4a9d7f6c04c3?auto=format&fit=crop&w=1200&q=80"
          />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.36em] text-slate-600">Curated edit</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-black sm:text-4xl">A premium showcase</h2>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-slate-50"
          >
            Shop the full edit
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="group relative overflow-hidden rounded-4xl border border-slate-200 bg-slate-50 shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1200&q=80"
              alt="Luxury streetwear editorial"
              className="h-96 w-full object-cover transition duration-500 group-hover:scale-[1.02]"
              loading="lazy"
            />
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.0) 55%)',
              }}
            />
            <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-3 rounded-3xl border border-slate-300 bg-white/95 p-5 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.32em] text-slate-700">Editorial</p>
              <p className="text-2xl font-bold tracking-tight text-black">Ultra modern silhouettes with refined edge.</p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-lg">
              <p className="text-xs uppercase tracking-[0.32em] text-slate-700">City essentials</p>
              <h3 className="mt-3 text-2xl font-black text-black">Dark tonal styling</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Bold layering, premium materials and tailored utility for the city wardrobe.
              </p>
              <div className="mt-6 grid gap-3 text-sm text-slate-700">
                <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                  <span>Leather outerwear</span>
                  <span className="font-semibold text-slate-900">New</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                  <span>Modern knitwear</span>
                  <span className="font-semibold text-slate-900">Best-seller</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                  <span>Limited sneakers</span>
                  <span className="font-semibold text-slate-900">Drop</span>
                </div>
              </div>
            </div>
            <div className="rounded-4xl border border-slate-300 bg-slate-900 p-6 text-white shadow-lg">
              <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Service</p>
              <h3 className="mt-3 text-2xl font-black">Private styling</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Personalized guidance and priority access for the SUPRA LUXE clientele.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white cursor-pointer hover:bg-slate-700">
                Request access
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.36em] text-slate-600">Featured</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-black sm:text-4xl">Trending products</h2>
          </div>
          <Link
            to="/women"
            className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-800 transition hover:text-black"
          >
            View all
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            <div className="col-span-full rounded-4xl border border-slate-200 bg-white p-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
              <p className="text-lg font-black text-black">Loading products…</p>
            </div>
          ) : trending.length ? (
            trending.map((p) => <ProductCard key={p.id} product={p} />)
          ) : (
            <div className="col-span-full rounded-4xl border border-slate-200 bg-white p-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
              <p className="text-lg font-black text-black">No products available yet</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                New products will appear here once the admin adds them.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

