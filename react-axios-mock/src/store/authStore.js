import { create } from 'zustand'
import { login as apiLogin, logout as apiLogout } from '../api/auth'

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,

  login: async (credentials) => {
    const res = await apiLogin(credentials)
    const { token, user } = res.data
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    set({ token, user })
    return res
  },

  logout: async () => {
    try { await apiLogout() } catch {}
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ token: null, user: null })
  },
}))

export default useAuthStore
