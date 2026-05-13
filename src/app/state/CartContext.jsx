import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useProducts } from './ProductContext.jsx'

const CartContext = createContext(null)

const STORAGE_KEY = 'supraluxe_cart_v1'

function readStoredCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter(Boolean)
      .map((i) => ({
        productId: String(i.productId),
        size: i.size ? String(i.size) : null,
        qty: Math.max(1, Number(i.qty) || 1),
      }))
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const { products } = useProducts()
  const [items, setItems] = useState(() => readStoredCart())

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // ignore storage quota / disabled storage
    }
  }, [items])

  const api = useMemo(() => {
    function addItem({ productId, size, qty = 1 }) {
      const pid = String(productId)
      const s = size ? String(size) : null
      const q = Math.max(1, Number(qty) || 1)

      setItems((prev) => {
        const idx = prev.findIndex((i) => i.productId === pid && i.size === s)
        if (idx === -1) return [...prev, { productId: pid, size: s, qty: q }]
        return prev.map((i, n) => (n === idx ? { ...i, qty: i.qty + q } : i))
      })
    }

    function setQty({ productId, size, qty }) {
      const pid = String(productId)
      const s = size ? String(size) : null
      const q = Math.max(1, Number(qty) || 1)
      setItems((prev) =>
        prev.map((i) =>
          i.productId === pid && i.size === s ? { ...i, qty: q } : i,
        ),
      )
    }

    function removeItem({ productId, size }) {
      const pid = String(productId)
      const s = size ? String(size) : null
      setItems((prev) => prev.filter((i) => !(i.productId === pid && i.size === s)))
    }

    function clear() {
      setItems([])
    }

    function count() {
      return items.reduce((sum, i) => sum + i.qty, 0)
    }

    function total() {
      return items.reduce((sum, i) => {
        const product = products.find((p) => String(p.id) === i.productId)
        return sum + (product ? product.price * i.qty : 0)
      }, 0)
    }

    return { items, addItem, setQty, removeItem, clear, count, total }
  }, [items])

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

