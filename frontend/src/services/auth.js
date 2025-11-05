import { api } from './api'

const TOKEN_KEY = 'token'
const ROLE_KEY = 'role'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(ROLE_KEY)
}

export function setUserRole(role) {
  localStorage.setItem(ROLE_KEY, role)
}

export function getUserRole() {
  return localStorage.getItem(ROLE_KEY) || null
}

export async function login(email, password) {
  const res = await api.post('/auth/login', { email, password })
  const token = res.data.access_token
  setToken(token)
  // fetch profile to determine role
  const me = await api.get('/users/me')
  setUserRole(me.data.is_admin ? 'admin' : 'user')
}

export async function register(formData) {
  await api.post('/auth/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
