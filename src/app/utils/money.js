export function formatINR(value) {
  const n = Number(value) || 0
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(n)
  } catch {
    return `₹${Math.round(n).toLocaleString('en-IN')}`
  }
}

export function percentOff({ price, mrp }) {
  const p = Number(price) || 0
  const m = Number(mrp) || 0
  if (!m || m <= p) return 0
  return Math.round(((m - p) / m) * 100)
}

