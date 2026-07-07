import { create } from 'zustand'
import { getLeaves, getMyLeaves, createLeave, updateLeave, approveLeave, rejectLeave, deleteLeave } from '../api/leave'

const useLeaveStore = create((set) => ({
  leaves: [],
  total: 0,
  loading: false,
  error: null,

  fetchLeaves: async (params) => {
    set({ loading: true, error: null })
    try {
      const res = await getLeaves(params)
      set({
        leaves: res.data || res,
        total: res.total || res.length || 0,
        loading: false
      })
    } catch (err) {
      set({ error: err?.response?.data || err?.message, loading: false })
    }
  },

  fetchMyLeaves: async (params) => {
    set({ loading: true, error: null })
    try {
      const res = await getMyLeaves(params)
      set({
        leaves: res.data || res,
        total: res.total || res.length || 0,
        loading: false
      })
    } catch (err) {
      set({ error: err?.response?.data || err?.message, loading: false })
    }
  },

  createLeave: async (data) => {
    try {
      await createLeave(data)
    } catch (err) {
      set({ error: err?.response?.data || err?.message })
    }
  },

  updateLeave: async (id, data) => {
    try {
      await updateLeave(id, data)
    } catch (err) {
      set({ error: err?.response?.data || err?.message })
    }
  },

  approveLeave: async (id) => {
    try {
      await approveLeave(id)
    } catch (err) {
      set({ error: err?.response?.data || err?.message })
    }
  },

  rejectLeave: async (id, remark) => {
    try {
      await rejectLeave(id, remark)
    } catch (err) {
      set({ error: err?.response?.data || err?.message })
    }
  },

  deleteLeave: async (id) => {
    try {
      await deleteLeave(id)
    } catch (err) {
      set({ error: err?.response?.data || err?.message })
    }
  },

  clearError: () => set({ error: null })
}))

export default useLeaveStore
