
// POST /auth/register          → recruiter signup
// POST /auth/register/candidate → candidate signup
// POST /auth/login             → shared login (both roles)
// GET  /auth/me                → get current user (requires token)

import axios from 'axios'

const API = 'http://127.0.0.1:8000/api'

// ── Token helpers ─────────────────────────────────────────────────────────────

export const saveToken   = (token) => localStorage.setItem('hirein_token', token)
export const getToken    = ()      => localStorage.getItem('hirein_token')
export const removeToken = ()      => localStorage.removeItem('hirein_token')
export const saveUser    = (user)  => localStorage.setItem('hirein_user', JSON.stringify(user))
export const getUser     = ()      => { try { return JSON.parse(localStorage.getItem('hirein_user')) } catch { return null } }
export const removeUser  = ()      => localStorage.removeItem('hirein_user')
export const isLoggedIn  = ()      => !!getToken()

// Auth header for protected requests
export const authHeader  = () => ({ Authorization: `Bearer ${getToken()}` })

// ── API calls ─────────────────────────────────────────────────────────────────

// Recruiter registration → POST /auth/register
// Body: { username, email, password }
// Returns: { access_token, token_type, user: { id, username, email, role, auth_provider, created_at } }
export const registerRecruiter = async ({ username, email, password }) => {
    const res = await axios.post(`${API}/auth/register`, { username, email, password })
    return res.data
}

// Candidate registration → POST /auth/register/candidate
// Same body shape, different role stamped by backend
export const registerCandidate = async ({ username, email, password }) => {
    const res = await axios.post(`${API}/auth/register/candidate`, { username, email, password })
    return res.data
}

// Login (both roles) → POST /auth/login
// Body: { username_or_email, password }   ← field name must match backend LoginRequest
// Returns: { access_token, token_type, user }
export const login = async ({ identifier, password }) => {
    const res = await axios.post(`${API}/auth/login`, {
        username_or_email: identifier,   // backend expects "username_or_email"
        password,
    })
    return res.data
}

// Get current user → GET /auth/me  (requires Bearer token)
export const getMe = async () => {
    const res = await axios.get(`${API}/auth/me`, { headers: authHeader() })
    return res.data
}

// ── Logout helper ─────────────────────────────────────────────────────────────
export const logout = () => {
    removeToken()
    removeUser()
}