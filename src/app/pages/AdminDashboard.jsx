import { useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '../state/AuthContext.jsx'
import { broadcastProductsUpdated } from '../state/ProductContext.jsx'
import { formatINR } from '../utils/money.js'
import { apiFetch, apiPost, apiPut, apiDelete } from '../../utils/api.js'
import { Activity, BarChart3, CreditCard, Plus, ShoppingBag, Trash2, Users } from 'lucide-react'

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

export function AdminDashboard() {
  const { user, logout } = useAuth()
  const logoutRef = useRef(logout)
  const [activeSection, setActiveSection] = useState('overview')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    price: '',
    mrp: '',
    category: '',
    gender: 'women',
    color: '',
    description: '',
    tags: '',
    sizes: 'S,M,L,XL',
    images: '',
  })

  useEffect(() => {
    logoutRef.current = logout
  }, [logout])

  const fetchData = async () => {
    setLoading(true)
    try {
      const data = await apiFetch('/api/admin/dashboard?limit=100')
      setProducts(data.products || [])
      setOrders(data.orders || [])
      setUsers(data.users || [])
      setError(null)
    } catch (err) {
      setError(err.message || 'Failed to load admin dashboard')
      console.error('Admin dashboard fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user) {
      setLoading(false)
      setError('Please log in to access the admin dashboard.')
      return
    }

    fetchData()
  }, [user])

  const validateImageUrl = (value) => {
    if (!value) return false
    const trimmed = value.trim()
    const standardPattern = /^https?:\/\/[\w.-]+(?:\/[\w\-.~:?#[\]@!$&'()*+,;=]*)*\.(?:jpg|jpeg|png|webp|gif|svg)(?:\?.*)?$/i
    const cloudinaryPattern = /^https?:\/\/res\.cloudinary\.com\/[\w-]+\/.*$/i
    return standardPattern.test(trimmed) || cloudinaryPattern.test(trimmed)
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingProduct(null)
    setFormData({
      title: '',
      brand: '',
      price: '',
      mrp: '',
      category: '',
      gender: 'women',
      color: '',
      description: '',
      tags: '',
      sizes: 'S,M,L,XL',
      images: '',
    })
  }

  const showToast = (type, message) => {
    setToast({ type, message })
    window.setTimeout(() => setToast(null), 4000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const images = String(formData.images || '')
        .split(/[\n,]+/)
        .map((src) => src.trim())
        .filter(Boolean)
      const tags = String(formData.tags || '')
        .split(/[\n,]+/)
        .map((tag) => tag.trim())
        .filter(Boolean)
      const sizes = String(formData.sizes || '')
        .split(/[\n,]+/)
        .map((size) => size.trim())
        .filter(Boolean)

      if (!formData.title.trim()) {
        throw new Error('Title is required.')
      }
      if (!formData.brand.trim()) {
        throw new Error('Brand is required.')
      }
      if (!String(formData.price).trim() || Number.isNaN(Number(formData.price))) {
        throw new Error('Valid price is required.')
      }
      if (formData.mrp !== '' && Number.isNaN(Number(formData.mrp))) {
        throw new Error('Valid MRP is required.')
      }
      if (!formData.gender) {
        throw new Error('Product gender must be selected.')
      }
      if (!images.length) {
        throw new Error('At least one image URL is required.')
      }
      if (!images.every(validateImageUrl)) {
        throw new Error('One or more image URLs are invalid. Use full http(s) URLs or Cloudinary links.')
      }

      const priceValue = Number(String(formData.price).trim())
      const mrpValue = formData.mrp !== '' ? Number(String(formData.mrp).trim()) : undefined

      const payload = {
        title: formData.title.trim(),
        brand: formData.brand.trim(),
        price: priceValue,
        mrp: mrpValue,
        category: formData.category.trim(),
        gender: formData.gender,
        color: formData.color.trim(),
        description: formData.description.trim(),
        tags,
        sizes,
        images,
      }

      const productId = editingProduct?.id || editingProduct?._id
      console.log('Admin submit payload:', {
        productId,
        editingProduct,
        payload,
      })

      if (editingProduct && !productId) {
        throw new Error('Unable to determine the product ID for update.')
      }

      const result = editingProduct
        ? await apiPut(`/api/products/${productId}`, payload)
        : await apiPost('/api/products', payload)

      console.log('Admin submit response:', result)

      await fetchData()
      broadcastProductsUpdated()
      resetForm()
      showToast('success', editingProduct ? 'Product updated successfully.' : 'Product added successfully.')
    } catch (err) {
      console.error('Admin product submit error:', err)
      setError(err.message || 'Could not save product.')
      showToast('error', err.message || 'Could not save product.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      title: product.title || '',
      brand: product.brand || '',
      price: product.price || '',
      mrp: product.mrp || '',
      category: product.category || '',
      gender: product.gender || 'women',
      color: product.color || '',
      description: product.description || '',
      tags: (product.tags || []).join(', '),
      sizes: (product.sizes || []).join(', '),
      images: (product.images || []).join(', '),
    })
    setShowForm(true)
  }

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Delete this product permanently?')) return

    try {
      await apiDelete(`/api/products/${productId}`)
      await fetchData()
      broadcastProductsUpdated()
    } catch (err) {
      console.error('Admin delete product error:', err)
      setError(err.message)
    }
  }

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await apiPut(`/api/orders/${orderId}`, { status: newStatus })
      await fetchData()
    } catch (err) {
      console.error('Admin update order status error:', err)
      setError(err.message)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Remove this user from the system?')) return

    try {
      await apiDelete(`/api/users/${userId}`)
      await fetchData()
    } catch (err) {
      console.error('Admin delete user error:', err)
      setError(err.message)
    }
  }

  const handleToggleRole = async (userItem) => {
    try {
      const nextRole = userItem.role === 'admin' ? 'customer' : 'admin'
      await apiPut(`/api/users/${userItem.id}`, { role: nextRole })
      await fetchData()
    } catch (err) {
      console.error('Admin toggle role error:', err)
      setError(err.message)
    }
  }

  const orderSummary = useMemo(
    () => orders.reduce(
      (summary, order) => ({
        totalRevenue: summary.totalRevenue + Number(order.total || 0),
        totalOrders: summary.totalOrders + 1,
      }),
      { totalRevenue: 0, totalOrders: 0 },
    ),
    [orders],
  )

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="text-center">
          <p className="text-sm text-slate-500">Please log in to access the admin dashboard.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-600"></div>
          <p className="text-sm text-slate-500">Loading admin console…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center max-w-md">
          <p className="text-sm font-semibold text-red-900">Error</p>
          <p className="mt-2 text-sm text-red-700">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-6 lg:p-10">
      {toast ? (
        <div
          className={`fixed bottom-6 right-6 z-50 max-w-sm rounded-3xl px-5 py-4 text-sm font-semibold shadow-2xl transition duration-300 ${
            toast.type === 'success'
              ? 'bg-emerald-500 text-white'
              : 'bg-red-600 text-white'
          }`}
        >
          {toast.message}
        </div>
      ) : null}
      <div className="rounded-4xl bg-slate-950 px-6 py-8 text-white shadow-2xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">SUPRA LUXE Admin</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight">Management console</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Secure admin access for product curation, order fulfillment, user management, and luxury analytics.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Revenue</p>
              <p className="mt-3 text-3xl font-black">₹{orderSummary.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Orders</p>
              <p className="mt-3 text-3xl font-black">{orderSummary.totalOrders}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Products</p>
              <p className="mt-3 text-3xl font-black">{products.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-4xl border border-slate-200 bg-white p-6 shadow-lg">
          <div className="space-y-5">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Navigation</p>
            </div>
            {[
              { key: 'overview', label: 'Overview', icon: BarChart3 },
              { key: 'products', label: 'Products', icon: ShoppingBag },
              { key: 'orders', label: 'Orders', icon: CreditCard },
              { key: 'users', label: 'Users', icon: Users },
            ].map((item) => {
              const Icon = item.icon
              return (
                <button
                  type="button"
                  key={item.key}
                  onClick={() => setActiveSection(item.key)}
                  className={`flex w-full items-center gap-3 rounded-3xl px-4 py-4 text-left text-sm font-semibold transition ${
                    activeSection === item.key
                      ? 'bg-slate-950 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </button>
              )
            })}
          </div>
        </aside>

        <section className="space-y-6">
          {error ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {activeSection === 'overview' && (
            <div className="grid gap-6 xl:grid-cols-3">
              <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between text-slate-500">
                  <p className="text-xs uppercase tracking-[0.26em]">Monthly revenue</p>
                  <Activity className="h-5 w-5" />
                </div>
                <p className="mt-5 text-3xl font-black text-slate-950">₹{orderSummary.totalRevenue.toLocaleString()}</p>
                <p className="mt-3 text-sm text-slate-600">Sales and order trends at a glance.</p>
              </div>
              <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs uppercase tracking-[0.26em] text-slate-500">Pending orders</p>
                <p className="mt-5 text-3xl font-black text-slate-950">{orders.filter((order) => order.status === 'pending').length}</p>
                <p className="mt-3 text-sm text-slate-600">Orders waiting for processing.</p>
              </div>
              <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs uppercase tracking-[0.26em] text-slate-500">User accounts</p>
                <p className="mt-5 text-3xl font-black text-slate-950">{users.length}</p>
                <p className="mt-3 text-sm text-slate-600">Customer and admin accounts.</p>
              </div>
            </div>
          )}

          {activeSection === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-950">Products</h2>
                  <p className="mt-2 text-sm text-slate-600">Add, edit or remove catalog items.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForm((current) => !current)}
                  className="inline-flex items-center gap-2 rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  <Plus className="h-4 w-4" />
                  {showForm ? 'Hide form' : 'Add product'}
                </button>
              </div>

              {showForm ? (
                <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-950">{editingProduct ? 'Edit product' : 'New product'}</h3>
                  <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                    {[
                      { label: 'Title', name: 'title', type: 'text' },
                      { label: 'Brand', name: 'brand', type: 'text' },
                      { label: 'Color', name: 'color', type: 'text' },
                      { label: 'Category', name: 'category', type: 'text' },
                      { label: 'Price', name: 'price', type: 'number' },
                      { label: 'MRP', name: 'mrp', type: 'number' },
                    ].map((field) => (
                      <label key={field.name} className="block">
                        <span className="text-sm font-semibold text-slate-700">{field.label}</span>
                        <input
                          type={field.type}
                          value={formData[field.name]}
                          onChange={(e) => setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))}
                          className="mt-2 h-12 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none focus:border-slate-900"
                          required={field.name !== 'mrp'}
                        />
                      </label>
                    ))}
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">Gender</span>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData((prev) => ({ ...prev, gender: e.target.value }))}
                        className="mt-2 h-12 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none"
                      >
                        <option value="women">Women</option>
                        <option value="men">Men</option>
                      </select>
                    </label>
                    <label className="block md:col-span-2">
                      <span className="text-sm font-semibold text-slate-700">Description</span>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                        className="mt-2 h-28 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">Sizes</span>
                      <input
                        value={formData.sizes}
                        onChange={(e) => setFormData((prev) => ({ ...prev, sizes: e.target.value }))}
                        className="mt-2 h-12 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none"
                        placeholder="S,M,L,XL"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">Tags</span>
                      <input
                        value={formData.tags}
                        onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
                        className="mt-2 h-12 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none"
                        placeholder="New, Bestseller"
                      />
                    </label>
                    <label className="block md:col-span-2">
                      <span className="text-sm font-semibold text-slate-700">Image URLs</span>
                      <input
                        value={formData.images}
                        onChange={(e) => setFormData((prev) => ({ ...prev, images: e.target.value }))}
                        className="mt-2 h-12 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none"
                        placeholder="Paste URLs separated by commas"
                      />
                    </label>
                    <div className="md:col-span-2 flex flex-wrap gap-3">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center justify-center rounded-3xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {submitting ? (editingProduct ? 'Updating…' : 'Creating…') : editingProduct ? 'Update product' : 'Create product'}
                      </button>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="inline-flex items-center justify-center rounded-3xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              ) : null}

              <div className="overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-sm">
                <table className="min-w-full text-left">
                  <thead className="bg-slate-100 text-sm uppercase tracking-[0.2em] text-slate-500">
                    <tr>
                      <th className="px-4 py-4">Product</th>
                      <th className="px-4 py-4">Price</th>
                      <th className="px-4 py-4">Category</th>
                      <th className="px-4 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id} className="border-t border-slate-200">
                        <td className="px-4 py-4 text-sm text-slate-800">{product.title || product.name}</td>
                        <td className="px-4 py-4 text-sm font-semibold text-slate-900">₹{product.price}</td>
                        <td className="px-4 py-4 text-sm text-slate-600">{product.category}</td>
                        <td className="px-4 py-4 space-x-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(product)}
                            className="rounded-2xl bg-slate-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(product._id)}
                            className="rounded-2xl bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-500"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-950">Orders</h2>
                  <p className="mt-2 text-sm text-slate-600">Review orders and update fulfillment status.</p>
                </div>
              </div>

              <div className="overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-sm">
                <table className="min-w-full text-left">
                  <thead className="bg-slate-100 text-sm uppercase tracking-[0.2em] text-slate-500">
                    <tr>
                      <th className="px-4 py-4">Order</th>
                      <th className="px-4 py-4">Customer</th>
                      <th className="px-4 py-4">Total</th>
                      <th className="px-4 py-4">Status</th>
                      <th className="px-4 py-4">Date</th>
                      <th className="px-4 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} className="border-t border-slate-200">
                        <td className="px-4 py-4 text-sm text-slate-800">{order._id.slice(-6).toUpperCase()}</td>
                        <td className="px-4 py-4 text-sm text-slate-800">{order.customerName || order.customerEmail}</td>
                        <td className="px-4 py-4 text-sm font-semibold text-slate-900">₹{order.total}</td>
                        <td className="px-4 py-4">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                            className="h-11 rounded-2xl border border-slate-300 bg-slate-50 px-3 text-sm text-slate-900"
                          >
                            {ORDER_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-4">
                          <button className="rounded-2xl bg-slate-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800">
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'users' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-slate-950">Manage Users</h2>
                <p className="mt-2 text-sm text-slate-600">View customers, update roles, and remove accounts.</p>
              </div>
              <div className="overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-sm">
                <table className="min-w-full text-left">
                  <thead className="bg-slate-100 text-sm uppercase tracking-[0.2em] text-slate-500">
                    <tr>
                      <th className="px-4 py-4">Name</th>
                      <th className="px-4 py-4">Email</th>
                      <th className="px-4 py-4">Role</th>
                      <th className="px-4 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((userItem) => (
                      <tr key={userItem.id} className="border-t border-slate-200">
                        <td className="px-4 py-4 text-sm text-slate-800">{userItem.name}</td>
                        <td className="px-4 py-4 text-sm text-slate-600">{userItem.email}</td>
                        <td className="px-4 py-4 text-sm text-slate-800 capitalize">{userItem.role}</td>
                        <td className="px-4 py-4 space-x-2">
                          <button
                            type="button"
                            onClick={() => handleToggleRole(userItem)}
                            className="rounded-2xl bg-slate-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                          >
                            {userItem.role === 'admin' ? 'Make customer' : 'Make admin'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(userItem.id)}
                            className="rounded-2xl bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-500"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
