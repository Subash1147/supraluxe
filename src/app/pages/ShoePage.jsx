import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Filter, Search, X } from 'lucide-react'
import { ProductListCard } from '../ui/ProductListCard.jsx'
import { useProducts } from '../state/ProductContext.jsx'

export function ShoePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = (searchParams.get('q') || '').trim()
  const sort = searchParams.get('sort') || 'reco'
  const minPrice = Number(searchParams.get('min') || '') || 0
  const maxPrice = Number(searchParams.get('max') || '') || 0
  const minRating = Number(searchParams.get('rating') || '') || 0

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [searchDraft, setSearchDraft] = useState(q)
  const { products, loading } = useProducts()

  const list = useMemo(() => {
    let out = products.filter((p) => 
      p.title.toLowerCase().includes('shoe') || 
      p.title.toLowerCase().includes('sneaker') ||
      p.title.toLowerCase().includes('boot')
    )
    
    if (q) {
      const needle = q.toLowerCase()
      out = out.filter(
        (p) =>
          p.title.toLowerCase().includes(needle) ||
          p.brand.toLowerCase().includes(needle) ||
          p.color.toLowerCase().includes(needle),
      )
    }
    if (minPrice) out = out.filter((p) => p.price >= minPrice)
    if (maxPrice) out = out.filter((p) => p.price <= maxPrice)
    if (minRating) out = out.filter((p) => p.rating >= minRating)
    if (sort === 'price_asc') out = [...out].sort((a, b) => a.price - b.price)
    if (sort === 'price_desc') out = [...out].sort((a, b) => b.price - a.price)
    if (sort === 'rating') out = [...out].sort((a, b) => b.rating - a.rating)
    return out
  }, [maxPrice, minPrice, minRating, q, sort])

  function setSort(next) {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('sort', next)
    setSearchParams(nextParams, { replace: true })
  }

  function setParam(key, value) {
    const nextParams = new URLSearchParams(searchParams)
    if (value === '' || value === null || value === undefined || value === 0) {
      nextParams.delete(key)
    } else {
      nextParams.set(key, String(value))
    }
    setSearchParams(nextParams, { replace: true })
  }

  function clearFilters() {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.delete('min')
    nextParams.delete('max')
    nextParams.delete('rating')
    setSearchParams(nextParams, { replace: true })
  }

  function onSearchSubmit(e) {
    e.preventDefault()
    const val = searchDraft.trim()
    setParam('q', val || '')
  }

  const activeFilterCount =
    (minPrice ? 1 : 0) + (maxPrice ? 1 : 0) + (minRating ? 1 : 0)

  const FiltersPanel = (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-black tracking-tight text-black">Filters</p>
        {activeFilterCount ? (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-semibold text-gray-600 transition hover:text-black"
          >
            Clear all
          </button>
        ) : null}
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-[0_20px_40px_rgba(0,0,0,0.10)]">
        <p className="text-xs font-semibold tracking-[0.24em] text-gray-600">PRICE</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs font-semibold text-gray-700">Min</span>
            <input
              inputMode="numeric"
              value={minPrice || ''}
              onChange={(e) => setParam('min', Number(e.target.value) || 0)}
              placeholder="0"
              className="mt-2 h-11 w-full rounded-2xl border border-slate-300 bg-white px-3 text-sm text-black outline-none transition focus:border-black focus:ring-2 focus:ring-black/20"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-gray-700">Max</span>
            <input
              inputMode="numeric"
              value={maxPrice || ''}
              onChange={(e) => setParam('max', Number(e.target.value) || 0)}
              placeholder="5000"
              className="mt-2 h-11 w-full rounded-2xl border border-slate-300 bg-white px-3 text-sm text-black outline-none transition focus:border-black focus:ring-2 focus:ring-black/20"
            />
          </label>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-[0_20px_40px_rgba(0,0,0,0.10)]">
        <p className="text-xs font-semibold tracking-[0.24em] text-gray-600">RATINGS</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {[0, 3.5, 4.0, 4.5].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setParam('rating', r)}
              className={[
                'h-11 rounded-2xl border px-3 text-sm font-semibold transition',
                Number(minRating) === Number(r)
                  ? 'border-black bg-black text-white'
                  : 'border-slate-300 bg-slate-50 text-slate-700 hover:border-black hover:bg-white',
              ].join(' ')}
            >
              {r === 0 ? 'Any' : `${r}+`}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <section className="rounded-4xl border border-gray-200 bg-white p-6 shadow-[0_25px_70px_rgba(0,0,0,0.15)]">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.30em] text-gray-600">Shoe Collection</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-black sm:text-4xl">
              Premium Footwear
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-700">
              Explore our curated selection of premium shoes, sneakers, and boots featuring top brands and latest styles.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-600">Available</p>
              <p className="mt-3 text-2xl font-black text-black">{list.length}</p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-600">Filters active</p>
              <p className="mt-3 text-2xl font-black text-black">{activeFilterCount}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <form onSubmit={onSearchSubmit} className="flex items-center gap-3 flex-1">
          <div className="flex w-full max-w-2xl items-center gap-3 rounded-3xl border border-gray-200 bg-white px-4 py-3 shadow-[0_12px_30px_rgba(0,0,0,0.10)]">
            <Search className="h-4 w-4 text-gray-600" />
            <input
              value={searchDraft}
              onChange={(e) => setSearchDraft(e.target.value)}
              placeholder="Search shoes…"
              className="w-full bg-transparent text-sm text-black outline-none placeholder:text-gray-500"
              aria-label="Search products"
            />
            {searchDraft ? (
              <button
                type="button"
                onClick={() => {
                  setSearchDraft('')
                  setParam('q', '')
                }}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-semibold text-black transition hover:bg-gray-50 lg:hidden"
          >
            <Filter className="h-4 w-4 text-gray-600" />
            Filters {activeFilterCount ? `(${activeFilterCount})` : ''}
          </button>
        </form>

        <div className="relative flex w-full max-w-xs items-center gap-3 rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-black shadow-[0_12px_30px_rgba(0,0,0,0.10)]">
          <span className="uppercase tracking-[0.20em] text-gray-600">Sort</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-11 w-full rounded-2xl bg-transparent pr-9 text-sm text-black outline-none appearance-none focus:border-gold-500 focus:ring-0"
            aria-label="Sort products"
          >
            <option className="bg-white text-black" value="reco">Recommended</option>
            <option className="bg-white text-black" value="price_asc">Price: Low to High</option>
            <option className="bg-white text-black" value="price_desc">Price: High to Low</option>
            <option className="bg-white text-black" value="rating">Top Rated</option>
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">▾</span>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-[0_15px_45px_rgba(0,0,0,0.08)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-black">{list.length}</span> items
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <aside className="hidden lg:block">{FiltersPanel}</aside>

        <div>
          {loading ? (
            <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-[0_20px_70px_rgba(0,0,0,0.10)]">
              <p className="text-base font-bold text-black">Loading shoes…</p>
            </div>
          ) : list.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {list.map((p) => (
                <ProductListCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-[0_20px_70px_rgba(0,0,0,0.10)]">
              <p className="text-base font-bold text-black">No products available yet</p>
              <p className="mt-2 text-sm text-gray-600">The admin has not added any footwear products yet.</p>
            </div>
          )}
        </div>
      </div>

      {mobileFiltersOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close filters overlay"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85dvh] overflow-auto rounded-t-3xl bg-slate-950/95 p-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <p className="text-sm font-black text-white">Filters</p>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/90 text-white hover:bg-slate-800"
                aria-label="Close filters"
                onClick={() => setMobileFiltersOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4">{FiltersPanel}</div>
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-2xl bg-gold-500 px-5 text-sm font-semibold text-charcoal hover:bg-gold-400"
            >
              View results
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
