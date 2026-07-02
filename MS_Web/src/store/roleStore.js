import { create } from 'zustand'
import { getRoles, createRole, updateRole, deleteRole } from '../api/role'

const useRoleStore = create((set) => ({
  roles: [],
  loading: false,
  error: null,

  fetchRoles: async () => {
    set({ loading: true, error: null })
    try {
      const res = await getRoles()
      set({ roles: res, loading: false })
    } catch (err) {
      set({ error: err?.response?.data || err?.message, loading: false })
    }
  },

  createRole: async (data) => {
    try {
      await createRole(data)
      const res = await getRoles()
      set({ roles: res })
    } catch (err) {
      set({ error: err?.response?.data || err?.message })
    }
  },

  updateRole: async (id, data) => {
    try {
      await updateRole(id, data)
      const res = await getRoles()
      set({ roles: res })
    } catch (err) {
      set({ error: err?.response?.data || err?.message })
    }
  },

  deleteRole: async (id) => {
    try {
      await deleteRole(id)
      const res = await getRoles()
      set({ roles: res })
    } catch (err) {
      set({ error: err?.response?.data || err?.message })
    }
  },
}))

export default useRoleStore
