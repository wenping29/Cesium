import { create } from 'zustand'
import { getAnnualLeaves, getMyAnnualLeaves, createAnnualLeave, updateAnnualLeave, deleteAnnualLeave } from '../api/annualleave'

const useAnnualLeaveStore = create((set) => ({
  annualleaves: [],
  total: 0,
  loading: false,
  error: null,

  fetchAnnualLeaves: async (params) => {
    set({ loading: true, error: null })
    try {
      const res = await getAnnualLeaves(params)
      set({
        annualleaves: res.data || res,
        total: res.total || res.length || 0,
        loading: false
      })
    } catch (err) {
      set({ error: err?.response?.data || err?.message, loading: false })
    }
  },

  fetchMyAnnualLeaves: async (params) => {
    set({ loading: true, error: null })
    try {
      const res = await getMyAnnualLeaves(params)
      set({
        annualleaves: res.data || res,
        total: res.total || res.length || 0,
        loading: false
      })
    } catch (err) {
      set({ error: err?.response?.data || err?.message, loading: false })
    }
  },

  createAnnualLeave: async (data) => {
    try {
      await createAnnualLeave(data)
    } catch (err) {
      set({ error: err?.response?.data || err?.message })
    }
  },

  updateAnnualLeave: async (id, data) => {
    try {
      await updateAnnualLeave(id, data)
    } catch (err) {
      set({ error: err?.response?.data || err?.message })
    }
  },

  deleteAnnualLeave: async (id) => {
    try {
      await deleteAnnualLeave(id)
    } catch (err) {
      set({ error: err?.response?.data || err?.message })
    }
  },

  clearError: () => set({ error: null })
}))

export default useAnnualLeaveStore
