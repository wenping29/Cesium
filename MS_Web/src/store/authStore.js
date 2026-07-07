import { create } from 'zustand'
import { login as apiLogin, logout as apiLogout, getMe as apiGetMe, changePassword as apiChangePassword, updateProfile as apiUpdateProfile } from '../api/auth'

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,

  login: async (credentials) => {
    const res = await apiLogin(credentials)
    const { token, user } = res
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

  getProfile: async () => {
    const res = await apiGetMe()
    const user = res
    localStorage.setItem('user', JSON.stringify(user))
    set({ user })
    return res
  },

  updateProfile: async (data) => {
    const res = await apiUpdateProfile(data)
    const user = res
    localStorage.setItem('user', JSON.stringify(user))
    set({ user })
    return res
  },

  changePassword: async (data) => {
    return await apiChangePassword(data)
  },

  hasRole: (roleName) => {
    const user = get().user
    return user?.roles?.includes(roleName) || false
  },
}))

export default useAuthStore
