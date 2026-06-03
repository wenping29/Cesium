import { create } from 'zustand'
import { login as apiLogin, logout as apiLogout, updateProfile as apiUpdateProfile } from '../api/auth'

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

  updateProfile: async (data) => {
    const res = await apiUpdateProfile(data)
    const updatedUser = { ...useAuthStore.getState().user, ...res.data }
    localStorage.setItem('user', JSON.stringify(updatedUser))
    set({ user: updatedUser })
    return res
  },
}))

export default useAuthStore
