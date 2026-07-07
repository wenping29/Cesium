import { create } from 'zustand'
import { getWorkHours, getMyWorkHours, createWorkHour, updateWorkHour, deleteWorkHour } from '../api/workhour'

const useWorkHourStore = create((set) => ({
  workhours: [],
  total: 0,
  loading: false,
  error: null,

  fetchWorkHours: async (params) => {
    set({ loading: true, error: null })
    try {
      const res = await getWorkHours(params)
      set({
        workhours: res.data || res,
        total: res.total || res.length || 0,
        loading: false
      })
    } catch (err) {
      set({ error: err?.response?.data || err?.message, loading: false })
    }
  },

  fetchMyWorkHours: async (params) => {
    set({ loading: true, error: null })
    try {
      const res = await getMyWorkHours(params)
      set({
        workhours: res.data || res,
        total: res.total || res.length || 0,
        loading: false
      })
    } catch (err) {
      set({ error: err?.response?.data || err?.message, loading: false })
    }
  },

  createWorkHour: async (data) => {
    try {
      await createWorkHour(data)
    } catch (err) {
      set({ error: err?.response?.data || err?.message })
    }
  },

  updateWorkHour: async (id, data) => {
    try {
      await updateWorkHour(id, data)
    } catch (err) {
      set({ error: err?.response?.data || err?.message })
    }
  },

  deleteWorkHour: async (id) => {
    try {
      await deleteWorkHour(id)
    } catch (err) {
      set({ error: err?.response?.data || err?.message })
    }
  },

  clearError: () => set({ error: null })
}))

export default useWorkHourStore
