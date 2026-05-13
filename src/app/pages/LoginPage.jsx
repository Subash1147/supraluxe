import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login, signInWithGoogle, user } = useAuth()
  const navigate = useNavigate()

  async function handleEmailLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      // User state will be updated by the context's auth listener
      // We'll navigate after state updates
    } catch (err) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    setError('')
    setLoading(true)

    try {
      await signInWithGoogle()
      // User state will be updated by the context's auth listener
    } catch (err) {
      setError(err.message || 'Failed to sign in with Google')
    } finally {
      setLoading(false)
    }
  }

  // Navigate after user state updates
  useEffect(() => {
    if (user) {
      navigate(user?.role === 'admin' ? '/admin' : '/profile')
    }
  }, [user, navigate])

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-10">
        <p className="text-xs font-bold tracking-wide text-zinc-500">ACCOUNT</p>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-zinc-950 sm:text-3xl">
          Login
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Sign in with your email or Google account.
        </p>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleEmailLogin}>
          <label className="block">
            <span className="text-sm font-semibold text-zinc-900">Email</span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-400 disabled:bg-zinc-100"
              placeholder="you@example.com"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-zinc-900">Password</span>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-400 disabled:bg-zinc-100"
              placeholder="••••••••"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-zinc-950 px-5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:bg-zinc-400"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 flex items-center gap-3">
          <div className="flex-1 border-t border-zinc-200" />
          <span className="text-xs text-zinc-500">OR</span>
          <div className="flex-1 border-t border-zinc-200" />
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="mt-4 inline-flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 disabled:bg-zinc-100"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </button>

        <div className="mt-6 text-center text-sm text-zinc-600">
          Don't have an account?{' '}
          <Link className="font-semibold text-zinc-950 hover:underline" to="/signup">
            Sign up
          </Link>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-zinc-600">
          <Link className="font-semibold text-zinc-700 hover:text-zinc-950" to="/">
            Go home
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white">
        <div className="relative h-full min-h-[320px]">
          <img
            src="https://images.unsplash.com/photo-1520975947491-4e1c492efaf0?auto=format&fit=crop&w=1600&q=80"
            alt="Editorial"
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-zinc-950/10 to-transparent" />
          <div className="absolute bottom-0 p-6 sm:p-10">
            <p className="text-xs font-bold tracking-wide text-white/80">
              MEMBERSHIP
            </p>
            <p className="mt-2 max-w-md text-2xl font-black tracking-tight text-white">
              Save your wishlist, track orders, and get personalised drops.
            </p>
            <p className="mt-3 text-sm text-white/80">
              Sign in to access your account with Firebase Authentication.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
