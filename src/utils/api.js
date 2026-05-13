// Get the API base URL from environment or use relative path
function getApiUrl() {
  const apiUrl = import.meta.env.VITE_API_URL
  return apiUrl || '/api'
}

export const API_BASE_URL = getApiUrl()

export async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const response = await fetch(url, options)
  
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.error?.message || `API Error: ${response.status}`)
  }
  
  return response.json()
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
