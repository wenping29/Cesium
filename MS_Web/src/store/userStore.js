import { create } from 'zustand'
import { getUsers, createUser as apiCreateUser, addRole, removeRole } from '../api/user'

const useUserStore = create((set) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null })
    try {
      const res = await getUsers()
      set({ users: res, loading: false })
    } catch (err) {
      set({ error: err?.response?.data || err?.message, loading: false })
    }
  },

  createUser: async (data) => {
    try {
      await apiCreateUser(data)
      const res = await getUsers()
      set({ users: res })
    } catch (err) {
      set({ error: err?.response?.data || err?.message })
    }
  },

  addRole: async (userId, roleName) => {
    try {
      await addRole(userId, roleName)
      const res = await getUsers()
      set({ users: res })
    } catch (err) {
      set({ error: err?.response?.data || err?.message })
    }
  },

  removeRole: async (userId, roleName) => {
    try {
      await removeRole(userId, roleName)
      const res = await getUsers()
      set({ users: res })
    } catch (err) {
      set({ error: err?.response?.data || err?.message })
    }
  },
}))

export default useUserStore
