import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Filter, Search, X } from 'lucide-react'
import { ProductListCard } from '../ui/ProductListCard.jsx'
import { useProducts } from '../state/ProductContext.jsx'

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = (searchParams.get('q') || '').trim()
  const category = (searchParams.get('category') || '').trim()
  const sort = searchParams.get('sort') || 'recommended'
  const [searchDraft, setSearchDraft] = useState(q)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const { products, loading } = useProducts()

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category || 'Other'))],
    [products],
  )

  const filteredProducts = useMemo(() => {
    let out = [...products]
    if (q) {
      const needle = q.toLowerCase()
      out = out.filter(
        (product) =>
          product.title.toLowerCase().includes(needle) ||
          product.brand.toLowerCase().includes(needle) ||
          product.category.toLowerCase().includes(needle) ||
          product.description.toLowerCase().includes(needle),
      )
    }
    if (category) {
      out = out.filter((product) => product.category === category)
    }
    if (sort === 'price_asc') {
      out = out.sort((a, b) => a.price - b.price)
    }
    if (sort === 'price_desc') {
      out = out.sort((a, b) => b.price - a.price)
    }
    return out
  }, [category, q, sort, products])

  function setParam(key, value) {
    const nextParams = new URLSearchParams(searchParams)
    if (value === '' || value === null || value === undefined) {
      nextParams.delete(key)
    } else {
      nextParams.set(key, String(value))
    }
    setSearchParams(nextParams, { replace: true })
  }

  function clearFilters() {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.delete('category')
    setSearchParams(nextParams, { replace: true })
  }

  function onSearchSubmit(e) {
    e.preventDefault()
    setParam('q', searchDraft.trim())
  }

  const activeFilterCount = category ? 1 : 0

  return (
    <div className="space-y-8">
      <section className="rounded-4xl border border-slate-200 bg-white p-8 shadow-[0_24px_60px_rgba(0,0,0,0.10)]">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-600">
              SUPRA LUXE Collection
            </p>
            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-black sm:text-5xl">
              Modern product curation for premium streetwear.
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Browse the full SUPRA LUXE catalog with live search, refined category filters, and effortless sorting for a polished shopping experience.
            </p>
          </div>

          <div className="grid gap-4 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-600">Total styles</p>
              <p className="mt-3 text-3xl font-black text-black">{products.length}</p>
            </div>
            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-600">Available categories</p>
              <p className="mt-3 text-3xl font-black text-black">{categories.length}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <aside className="hidden lg:block">
          <div className="space-y-6 rounded-4xl border border-slate-200 bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between">
              <p className="text-sm font-black uppercase tracking-[0.28em] text-black">Filters</p>
              {activeFilterCount ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-600 transition hover:text-black"
                >
                  Clear
                </button>
              ) : null}
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">Category</p>
                <div className="mt-4 grid gap-3">
                  <button
                    type="button"
                    onClick={() => setParam('category', '')}
                    className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                      category === ''
                        ? 'border-black bg-black text-white'
                        : 'border-slate-300 bg-white text-slate-800 hover:border-black hover:bg-slate-50'
                    }`}
                  >
                    All categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setParam('category', cat)}
                      className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                        category === cat
                          ? 'border-black bg-black text-white'
                          : 'border-slate-300 bg-white text-slate-800 hover:border-black hover:bg-slate-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="space-y-6">
          <div className="grid gap-3 rounded-4xl border border-slate-200 bg-white p-5 shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
            <form onSubmit={onSearchSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="sr-only" htmlFor="product-search">
                Search styles
              </label>
              <div className="flex w-full items-center gap-3 rounded-3xl border border-slate-300 bg-white px-4 py-3 shadow-sm">
                <Search className="h-4 w-4 text-slate-500" />
                <input
                  id="product-search"
                  value={searchDraft}
                  onChange={(e) => setSearchDraft(e.target.value)}
                  placeholder="Search dresses, sneakers, jackets…"
                  className="w-full bg-transparent text-sm font-semibold text-black outline-none placeholder:text-slate-400"
                  aria-label="Search products"
                />
                {searchDraft ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchDraft('')
                      setParam('q', '')
                    }}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-800 transition hover:bg-slate-50 lg:hidden"
              >
                <Filter className="h-4 w-4" />
                Filters{activeFilterCount ? ` (${activeFilterCount})` : ''}
              </button>
            </form>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setParam('category', cat)}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] transition ${
                      category === cat
                        ? 'border-black bg-black text-white'
                        : 'border-slate-300 bg-white text-slate-700 hover:border-black hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-black shadow-sm">
                <span className="uppercase tracking-[0.22em] text-slate-500">Sort</span>
                <select
                  value={sort}
                  onChange={(e) => setParam('sort', e.target.value)}
                  className="h-11 rounded-2xl bg-transparent px-2 text-sm text-black outline-none appearance-none"
                  aria-label="Sort products"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {loading ? (
              <div className="col-span-full rounded-4xl border border-slate-200 bg-white p-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
                <p className="text-lg font-black text-black">Loading products…</p>
              </div>
            ) : filteredProducts.length ? (
              filteredProducts.map((product) => (
                <ProductListCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full rounded-4xl border border-slate-200 bg-white p-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
                <p className="text-lg font-black text-black">No products available yet</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  The admin has not added any products. Please check back soon.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 inline-flex h-12 items-center justify-center rounded-2xl border border-black bg-black px-6 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {mobileFiltersOpen ? (
        <div className="fixed inset-0 z-50 bg-black/50 p-4 lg:hidden">
          <div className="mx-auto max-w-md rounded-4xl bg-white p-6 shadow-[0_24px_60px_rgba(0,0,0,0.16)]">
            <div className="flex items-center justify-between">
              <p className="text-sm font-black uppercase tracking-[0.28em] text-black">Filters</p>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-slate-800 transition hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">Category</p>
                <div className="mt-3 grid gap-3">
                  <button
                    type="button"
                    onClick={() => setParam('category', '')}
                    className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                      category === ''
                        ? 'border-black bg-black text-white'
                        : 'border-slate-300 bg-white text-slate-800 hover:border-black hover:bg-slate-50'
                    }`}
                  >
                    All categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setParam('category', cat)}
                      className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                        category === cat
                          ? 'border-black bg-black text-white'
                          : 'border-slate-300 bg-white text-slate-800 hover:border-black hover:bg-slate-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-6 inline-flex w-full items-center justify-center rounded-2xl border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
            >
              Apply filters
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
