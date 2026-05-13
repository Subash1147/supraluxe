import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const WishlistContext = createContext(null)
const STORAGE_KEY = 'supraluxe_wishlist_v1'

function readStoredWishlist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(Boolean).map((id) => String(id))
  } catch {
    return []
  }
}

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => readStoredWishlist())

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // ignore storage errors
    }
  }, [items])

  const api = useMemo(() => {
    function hasItem(productId) {
      return items.includes(String(productId))
    }

    function addItem(productId) {
      const id = String(productId)
      setItems((prev) => (prev.includes(id) ? prev : [...prev, id]))
    }

    function removeItem(productId) {
      const id = String(productId)
      setItems((prev) => prev.filter((item) => item !== id))
    }

    function toggleItem(productId) {
      const id = String(productId)
      setItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
    }

    function clear() {
      setItems([])
    }

    function count() {
      return items.length
    }

    return { items, hasItem, addItem, removeItem, toggleItem, clear, count }
  }, [items])

  return <WishlistContext.Provider value={api}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) {
    throw new Error('useWishlist must be used within WishlistProvider')
  }
  return ctx
}
