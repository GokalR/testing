/**
 * Thin API client for the Regional Strategist backend.
 * Base URL comes from VITE_API_URL (see .env or Railway/Vercel env settings).
 * If unset, all calls resolve as { ok: false, reason: 'no-backend' } so the
 * app keeps working in static/demo mode.
 */

const BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || ''

const isConfigured = () => Boolean(BASE)

async function request(path, options = {}) {
  if (!isConfigured()) return { ok: false, reason: 'no-backend' }
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' },
      ...options,
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      return { ok: false, status: res.status, error: text || res.statusText }
    }
    const data = await res.json()
    return { ok: true, data }
  } catch (e) {
    return { ok: false, error: String(e) }
  }
}

export const rsApi = {
  isConfigured,
  baseUrl: () => BASE,

  createSubmission: (payload) =>
    request('/submissions', { method: 'POST', body: JSON.stringify(payload) }),

  getSubmission: (id) => request(`/submissions/${id}`),

  uploadExcel: (subId, kind, file) => {
    const fd = new FormData()
    fd.append('kind', kind)
    fd.append('file', file)
    return request(`/submissions/${subId}/uploads`, { method: 'POST', body: fd })
  },

  listUploads: (subId) => request(`/submissions/${subId}/uploads`),

  runAnalysis: (subId, opts = {}) =>
    request(`/submissions/${subId}/analysis`, {
      method: 'POST',
      body: JSON.stringify(opts),
    }),

  latestAnalysis: (subId) => request(`/submissions/${subId}/analysis/latest`),

  health: () => request('/health'),
}
