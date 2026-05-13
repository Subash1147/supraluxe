import { useMemo, useRef, useState } from 'react'
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import { Heart, LogOut, Menu, Search, ShoppingBag, User, Users, X } from 'lucide-react'
import { useCart } from '../state/CartContext.jsx'
import { useAuth } from '../state/AuthContext.jsx'
import { useWishlist } from '../state/WishlistContext.jsx'

export function Header() {
  const navigate = useNavigate()
  const cart = useCart()
  const { user, logout } = useAuth()
  const wishlist = useWishlist()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const closeTimeoutRef = useRef(null)

  const [searchParams] = useSearchParams()
  const activeSearch = useMemo(() => searchParams.get('q') || '', [searchParams])
  const [q, setQ] = useState(activeSearch)

  function handleMenuMouseEnter() {
    if (window.innerWidth >= 1024) {
      clearTimeout(closeTimeoutRef.current)
      setUserMenuOpen(true)
    }
  }

  function handleMenuMouseLeave() {
    if (window.innerWidth >= 1024) {
      closeTimeoutRef.current = setTimeout(() => {
        setUserMenuOpen(false)
      }, 200)
    }
  }

  function onSubmit(e) {
    e.preventDefault()
    const query = q.trim()
    navigate(query ? `/products?q=${encodeURIComponent(query)}` : '/products')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="container-pad flex items-center gap-4 py-4">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <span className="text-2xl font-black tracking-tight text-black">SUPRA LUXE</span>
          <span className="hidden text-xs uppercase tracking-[0.32em] text-slate-600 sm:inline">
            Luxury Streetwear
          </span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-8 lg:flex">
          {[
            { to: '/', label: 'Home' },
            { to: '/men', label: 'Men' },
            { to: '/women', label: 'Women' },
            { to: '/products', label: 'Products' },
            { to: '/shoes', label: 'Shoes' },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `text-sm font-semibold uppercase tracking-wide rounded-full px-4 py-2 transition-all duration-300 ${
                  isActive ? 'bg-black text-white shadow-lg' : 'text-slate-800 hover:bg-black/5 hover:text-slate-900'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <Link
            to="/wishlist"
            className="relative inline-flex items-center gap-2 rounded-full border border-slate-300 px-3 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-800 transition hover:border-black hover:text-black"
          >
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Wishlist</span>
            {wishlist.count() > 0 ? (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                {wishlist.count()}
              </span>
            ) : null}
          </Link>

          <div 
            className="relative"
            onMouseEnter={handleMenuMouseEnter}
            onMouseLeave={handleMenuMouseLeave}
          >
            <button
              type="button"
              onClick={() => window.innerWidth < 1024 && setUserMenuOpen((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-3 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-800 transition hover:border-black hover:text-black"
            >
              <User className="h-4 w-4" />
              <span className="hidden lg:inline">Account</span>
            </button>
            {userMenuOpen ? (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-white/10 bg-black/95 p-4 shadow-2xl text-left text-sm transition-all duration-200 ease-out z-50">
                {user ? (
                  <>
                    <div className="mb-3 border-b border-white/10 pb-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white">Welcome back</p>
                      <p className="mt-1 text-sm font-medium text-white">{user.name || user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-white font-semibold transition hover:bg-white/10 hover:text-blue-400"
                    >
                      <User className="h-4 w-4 text-slate-400" />
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-white font-semibold transition hover:bg-white/10 hover:text-blue-400"
                    >
                      <ShoppingBag className="h-4 w-4 text-slate-400" />
                      Orders
                    </Link>
                    {user?.role === 'admin' ? (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2 text-white font-semibold transition hover:bg-white/10 hover:text-blue-400"
                      >
                        <Users className="h-4 w-4 text-slate-400" />
                        Admin
                      </Link>
                    ) : null}
                    <Link
                      to="/wishlist"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-white font-semibold transition hover:bg-white/10 hover:text-blue-400"
                    >
                      <Heart className="h-4 w-4 text-slate-400" />
                      Wishlist
                    </Link>
                    <Link
                      to="/cart"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-white font-semibold transition hover:bg-white/10 hover:text-blue-400"
                    >
                      <ShoppingBag className="h-4 w-4 text-slate-400" />
                      Cart
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        logout()
                        setUserMenuOpen(false)
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-white font-semibold transition hover:bg-white/10 hover:text-blue-400"
                    >
                      <LogOut className="h-4 w-4 text-slate-400" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-white font-semibold transition hover:bg-white/10 hover:text-blue-400"
                    >
                      <User className="h-4 w-4 text-slate-400" />
                      Login
                    </Link>
                    <div className="mt-3 border-t border-white/10 pt-3">
                      <p className="text-xs text-white font-semibold">New customer?</p>
                      <Link
                        to="/signup"
                        onClick={() => setUserMenuOpen(false)}
                        className="mt-1 inline-flex items-center gap-2 rounded-xl bg-slate-800 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 hover:text-gold-400"
                      >
                        Sign Up
                      </Link>
                    </div>
                  </>
                )}
              </div>
            ) : null}
          </div>

          <Link
            to="/cart"
            className="relative inline-flex items-center gap-2 rounded-full border border-slate-300 px-3 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-800 transition hover:border-black hover:text-black"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            {cart.count() > 0 ? (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                {cart.count()}
              </span>
            ) : null}
          </Link>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold-500/30 text-slate-800 transition hover:border-gold-400 hover:bg-gold-500/10 lg:hidden"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="container-pad hidden w-full pb-3 lg:block">
        <form
          onSubmit={onSubmit}
          className="flex items-center gap-3 rounded-full border border-gold-500/30 bg-luxury-100 px-4 py-2"
        >
          <Search className="h-4 w-4 text-luxury-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products…"
            className="w-full bg-transparent text-sm text-charcoal outline-none placeholder:text-slate-500"
            aria-label="Search"
          />
        </form>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/30"
            aria-label="Close menu overlay"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[84vw] max-w-sm border-r border-slate-200 bg-white px-4 py-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <span className="text-sm font-bold uppercase tracking-[0.22em] text-slate-900">Menu</span>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-900/90 transition hover:bg-slate-100"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="mt-4 flex flex-col gap-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/men', label: 'Men' },
                { to: '/women', label: 'Women' },
                { to: '/products', label: 'Products' },
                { to: '/shoes', label: 'Shoes' },
              ].map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `rounded-2xl px-4 py-3 text-sm font-semibold uppercase transition ${
                      isActive ? 'bg-gold-100 text-black' : 'text-black hover:bg-slate-100'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="mt-3 flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-black transition hover:bg-slate-100"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-black transition hover:bg-slate-100"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Orders
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-black transition hover:bg-slate-100"
                  >
                    <Heart className="h-4 w-4" />
                    Wishlist
                  </Link>
                  <Link
                    to="/cart"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-black transition hover:bg-slate-100"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Cart ({cart.count()})
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout()
                      setMobileOpen(false)
                    }}
                    className="mt-2 flex w-full items-center gap-2 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-black transition hover:bg-slate-100"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="mt-3 flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-black transition hover:bg-slate-100"
                  >
                    <User className="h-4 w-4" />
                    Login
                  </Link>
                  <div className="mt-3 border-t border-slate-200 pt-3">
                    <p className="text-xs text-black font-semibold">New customer?</p>
                    <Link
                      to="/signup"
                      onClick={() => setMobileOpen(false)}
                      className="mt-1 inline-flex items-center gap-2 rounded-xl bg-slate-800 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 hover:text-gold-400"
                    >
                      Sign Up
                    </Link>
                  </div>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

