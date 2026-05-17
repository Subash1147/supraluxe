// Get the API base URL from environment or use the Render backend URL
let API_BASE_URL = import.meta.env.VITE_API_URL || 'https://supraluxe.onrender.com'

// normalize: strip trailing slash to avoid "/api/api" when VITE_API_URL ends with /api
if (typeof API_BASE_URL === 'string' && API_BASE_URL.endsWith('/')) {
  API_BASE_URL = API_BASE_URL.replace(/\/+$/, '')
}

async function parseResponseBody(response) {
  const text = await response.text()
  if (!text) return {}

  try {
    return JSON.parse(text)
  } catch (err) {
    console.warn(`Invalid JSON response from ${response.url}:`, text)
    return { text }
  }
}

export async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  let response

  try {
    response = await fetch(url, options)
  } catch (err) {
    throw new Error(`Network request failed: ${err.message || 'Failed to connect to backend'}`)
  }

  const body = await parseResponseBody(response)

  if (!response.ok) {
    const message =
      (body && typeof body === 'object' && (body.error?.message || body.message)) ||
      (typeof body === 'string' ? body : `API Error: ${response.status}`)
    throw new Error(message)
  }

  return body
}

export async function apiFetch(endpoint) {
  return apiCall(endpoint, { method: 'GET' })
}

export async function apiPost(endpoint, data) {
  return apiCall(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function apiPut(endpoint, data) {
  return apiCall(endpoint, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function apiDelete(endpoint) {
  return apiCall(endpoint, { method: 'DELETE' })
}
