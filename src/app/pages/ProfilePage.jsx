import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'
import { LogOut, User, Mail, Calendar, ShoppingBag } from 'lucide-react'

export function ProfilePage() {
  const navigate = useNavigate()
  const { user, logout, isAuthenticated } = useAuth()
  const [loggingOut, setLoggingOut] = useState(false)

  if (!isAuthenticated) {
    return (
      <div className="py-12 px-4">
        <div className="mx-auto max-w-2xl rounded-3xl border border-zinc-200 bg-white p-8 text-center">
          <User className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
          <h2 className="text-2xl font-black text-zinc-950">Not Logged In</h2>
          <p className="mt-2 text-zinc-600">Please log in to view your profile</p>
          <div className="mt-6 flex gap-4 justify-center">
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl bg-zinc-950 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800 transition"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-200 px-6 py-3 text-sm font-semibold text-zinc-950 hover:border-zinc-300 transition"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    )
  }

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await logout()
      navigate('/')
    } catch (err) {
      console.error('Logout failed:', err)
      setLoggingOut(false)
    }
  }

  const createdDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown'

  const lastLoginDate = user?.lastLogin
    ? new Date(user.lastLogin).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'First login'

  return (
    <div className="py-12 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Profile Header */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-8 sm:p-12 mb-8">
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="h-24 w-24 rounded-2xl bg-linear-to-br from-gold-400 to-gold-600 flex items-center justify-center text-white">
                <User className="h-12 w-12" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-zinc-950">{user?.name || 'User'}</h1>
                <p className="mt-2 text-zinc-600">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="inline-flex items-center gap-2 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:bg-zinc-100 disabled:text-zinc-400 transition"
            >
              <LogOut className="h-4 w-4" />
              {loggingOut ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Account Information */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-8">
            <h2 className="text-lg font-black text-zinc-950 mb-6">Account Information</h2>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Full Name
                </label>
                <p className="mt-2 text-lg font-semibold text-zinc-950">{user?.name || 'N/A'}</p>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </label>
                <p className="mt-2 text-lg font-semibold text-zinc-950">{user?.email}</p>
              </div>

              {user?.isGoogleAuth && (
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                  <p className="text-xs font-semibold text-blue-700">Signed in with Google</p>
                </div>
              )}
            </div>
          </div>

          {/* Account Stats */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-8">
            <h2 className="text-lg font-black text-zinc-950 mb-6">Account History</h2>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Member Since
                </label>
                <p className="mt-2 text-lg font-semibold text-zinc-950">{createdDate}</p>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Last Login
                </label>
                <p className="mt-2 text-lg font-semibold text-zinc-950">{lastLoginDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 rounded-3xl border border-zinc-200 bg-white p-8">
          <h2 className="text-lg font-black text-zinc-950 mb-6">Quick Actions</h2>

          <div className="grid gap-4 sm:grid-cols-3">
            <Link
              to="/cart"
              className="flex items-center gap-3 rounded-xl border border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-950 hover:border-zinc-300 hover:bg-zinc-50 transition"
            >
              <ShoppingBag className="h-4 w-4" />
              View Cart
            </Link>

            <Link
              to="/products"
              className="flex items-center gap-3 rounded-xl border border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-950 hover:border-zinc-300 hover:bg-zinc-50 transition"
            >
              <ShoppingBag className="h-4 w-4" />
              Continue Shopping
            </Link>

            <Link
              to="/"
              className="flex items-center gap-3 rounded-xl bg-gold-400 px-4 py-3 text-sm font-semibold text-zinc-950 hover:bg-gold-500 transition"
            >
              <span>Browse Collections</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
