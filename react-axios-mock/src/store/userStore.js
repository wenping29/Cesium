import { create } from 'zustand'
import { getUsers, createUser as apiCreateUser } from '../api/user'

const useUserStore = create((set) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null })
    try {
      const res = await getUsers()
      set({ users: res.data, loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  createUser: async (data) => {
    try {
      await apiCreateUser(data)
      const res = await getUsers()
      set({ users: res.data })
    } catch (err) {
      set({ error: err.message })
    }
  },
}))

export default useUserStore
