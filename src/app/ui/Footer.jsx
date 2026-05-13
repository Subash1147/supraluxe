import { useState } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../config/firebase.js'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'

export function Footer() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function validateEmail(emailValue) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(emailValue)
  }

  async function handleNewsletterSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email.trim()) {
      setError('Please enter your email address')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)

    try {
      // Check if email already exists
      const q = query(
        collection(db, 'newsletterSubscribers'),
        where('email', '==', email.toLowerCase())
      )
      const snapshot = await getDocs(q)

      if (!snapshot.empty) {
        setError('This email is already subscribed to our newsletter')
        setLoading(false)
        return
      }

      // Add email to Firestore
      await addDoc(collection(db, 'newsletterSubscribers'), {
        email: email.toLowerCase(),
        subscribedAt: new Date(),
        status: 'active'
      })

      setSuccess('Thanks for subscribing to Supra Luxe!')
      setEmail('')

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess('')
      }, 5000)
    } catch (err) {
      console.error('Newsletter subscription error:', err)
      setError('Failed to subscribe. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-900">
      <div className="container-pad py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <p className="font-display text-lg font-bold tracking-tight text-black">
              SUPRA LUXE
            </p>
            <p className="mt-3 text-sm text-slate-600">
              Elevate your style with our curated collection of premium fashion essentials. 
              Crafted for those who appreciate luxury and sophistication.
            </p>
          </div>

          <div>
            <p className="font-semibold text-black">Shop</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>
                <Link className="hover:text-black transition-colors" to="/men">
                  Men
                </Link>
              </li>
              <li>
                <Link className="hover:text-black transition-colors" to="/women">
                  Women
                </Link>
              </li>
              <li>
                <Link className="hover:text-black transition-colors" to="/cart">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-black">Help</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li className="hover:text-black transition-colors cursor-pointer">Shipping & Delivery</li>
              <li className="hover:text-black transition-colors cursor-pointer">Returns Policy</li>
              <li className="hover:text-black transition-colors cursor-pointer">Payment Options</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-black">Contact Us</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>
                <a
                  href="tel:6382407058"
                  className="hover:text-black transition-colors"
                >
                  Phone: 6382407058
                </a>
              </li>
              <li>
                <a
                  href="mailto:subashuma95@gmail.com"
                  className="hover:text-black transition-colors"
                >
                  Email: subashuma95@gmail.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-black">Newsletter</p>
            <p className="mt-3 text-sm text-slate-600">
              Get drops, deals and style guides.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="mt-3 space-y-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none text-black placeholder:text-slate-400 focus:border-black focus:ring-1 focus:ring-black transition-colors disabled:opacity-50"
                  placeholder="Email address"
                  aria-label="Email address"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="h-11 shrink-0 rounded-xl bg-black px-4 text-sm font-semibold text-white hover:bg-slate-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                >
                  {loading ? 'Joining...' : 'Join'}
                </button>
              </div>
              {error && (
                <p className="text-xs font-semibold text-red-500">{error}</p>
              )}
              {success && (
                <p className="text-xs font-semibold text-green-600">{success}</p>
              )}
            </form>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Supraluxe. All rights reserved.</p>
          <p>Made with React + Tailwind.</p>
        </div>
      </div>
    </footer>
  )
}

