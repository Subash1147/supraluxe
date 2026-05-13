import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { apiFetch, apiPost, apiPut, apiDelete } from '../../utils/api.js'

const ProductContext = createContext(null)
const PRODUCT_UPDATE_EVENT = 'products:update'

async function fetchProductsFromApi() {
  const data = await apiFetch('/api/products?limit=100')
  return data.items || data
}

async function fetchProductByIdFromApi(id) {
  return apiFetch(`/api/products/${id}`)
}

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refreshProducts = async () => {
    setLoading(true)
    try {
      const items = await fetchProductsFromApi()
      setProducts(Array.isArray(items) ? items : [])
      setError(null)
    } catch (err) {
      console.error('Failed to load products:', err)
      setError(err.message || 'Failed to load products')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshProducts()

    const handleUpdate = () => {
      refreshProducts()
    }

    window.addEventListener(PRODUCT_UPDATE_EVENT, handleUpdate)
    return () => {
      window.removeEventListener(PRODUCT_UPDATE_EVENT, handleUpdate)
    }
  }, [])

  const getProductById = useMemo(
    () => (id) => products.find((product) => String(product.id) === String(id)),
    [products],
  )

  const fetchProductById = async (id) => {
    const existing = getProductById(id)
    if (existing) return existing

    try {
      const product = await fetchProductByIdFromApi(id)
      setProducts((prev) => {
        if (prev.some((item) => String(item.id) === String(product.id))) return prev
        return [product, ...prev]
      })
      return product
    } catch (err) {
      setError(err.message || 'Unable to load product')
      return null
    }
  }

  return (
    <ProductContext.Provider value={{ products, loading, error, refreshProducts, getProductById, fetchProductById }}>
      {children}
    </ProductContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductContext)
  if (!context) throw new Error('useProducts must be used within ProductProvider')
  return context
}

export function broadcastProductsUpdated() {
  window.dispatchEvent(new CustomEvent(PRODUCT_UPDATE_EVENT))
}
