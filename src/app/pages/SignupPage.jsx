import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'

export function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signup, signInWithGoogle, user } = useAuth()
  const navigate = useNavigate()

  async function handleEmailSignup(e) {
    e.preventDefault()
    setError('')

    if (!name) {
      setError('Full name is required')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      await signup(email, password, name)
      // User state will be updated by the context's auth listener
    } catch (err) {
      setError(err.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleSignup() {
    setError('')
    setLoading(true)

    try {
      await signInWithGoogle()
      // User state will be updated by the context's auth listener
    } catch (err) {
      setError(err.message || 'Failed to sign up with Google')
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
      <div className="rounded-3xl border border-slate-700 bg-black/95 p-6 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.25)]">
        <p className="text-xs font-bold tracking-wide text-slate-400">ACCOUNT</p>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
          Create Account
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Join us to save your wishlist and track orders.
        </p>

        {error && (
          <div className="mt-4 rounded-xl bg-red-900/90 border border-red-700 p-3 text-sm text-white">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleEmailSignup}>
          <label className="block">
            <span className="text-sm font-semibold text-slate-200">Full Name</span>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              className="mt-2 h-11 w-full rounded-xl border border-white/15 bg-black/80 px-4 text-sm text-white outline-none focus:border-white/30 focus:ring-0 disabled:bg-slate-800"
              placeholder="John Doe"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-200">Email</span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="mt-2 h-11 w-full rounded-xl border border-white/15 bg-black/80 px-4 text-sm text-white outline-none focus:border-white/30 focus:ring-0 disabled:bg-slate-800"
              placeholder="you@example.com"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-200">Password</span>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="mt-2 h-11 w-full rounded-xl border border-white/15 bg-black/80 px-4 text-sm text-white outline-none focus:border-white/30 focus:ring-0 disabled:bg-slate-800"
              placeholder="••••••••"
            />
            <p className="mt-1 text-xs text-slate-500">Minimum 6 characters</p>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-200">Confirm Password</span>
            <input
              required
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              className="mt-2 h-11 w-full rounded-xl border border-white/15 bg-black/80 px-4 text-sm text-white outline-none focus:border-white/30 focus:ring-0 disabled:bg-slate-800"
              placeholder="••••••••"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-white px-5 text-sm font-semibold text-black transition hover:bg-slate-200 disabled:bg-slate-700 disabled:text-slate-400"
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <div className="mt-6 flex items-center gap-3">
          <div className="flex-1 border-t border-slate-700" />
          <span className="text-xs text-slate-500">OR</span>
          <div className="flex-1 border-t border-slate-700" />
        </div>

        <button
          onClick={handleGoogleSignup}
          disabled={loading}
          className="mt-4 inline-flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:bg-slate-800"
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
          {loading ? 'Signing up...' : 'Sign up with Google'}
        </button>

        <div className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link className="font-semibold text-white hover:underline" to="/login">
            Sign in
          </Link>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
          <Link className="font-semibold text-white hover:text-slate-200" to="/">
            Go home
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-700 bg-black/95">
        <div className="relative h-full min-h-[320px]">
          <img
            src="https://images.unsplash.com/photo-1552053831-71594a27c62d?auto=format&fit=crop&w=1600&q=80"
            alt="Editorial"
            className="absolute inset-0 h-full w-full object-cover grayscale contrast-[0.8]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 p-6 sm:p-10">
            <p className="text-xs font-bold tracking-wide text-white/80">
              JOIN OUR COMMUNITY
            </p>
            <p className="mt-2 max-w-md text-2xl font-black tracking-tight text-white">
              Get exclusive access to new drops and personalized recommendations.
            </p>
            <p className="mt-3 text-sm text-white/70">
              Create an account powered by Firebase Authentication.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
