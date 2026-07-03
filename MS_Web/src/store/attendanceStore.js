import { create } from 'zustand'
import { getAttendances, getMyAttendances, createAttendance, updateAttendance, deleteAttendance } from '../api/attendance'

const useAttendanceStore = create((set) => ({
  attendances: [],
  loading: false,
  error: null,

  fetchAttendances: async (params) => {
    set({ loading: true, error: null })
    try {
      const res = await getAttendances(params)
      set({ attendances: res, loading: false })
    } catch (err) {
      set({ error: err?.response?.data || err?.message, loading: false })
    }
  },

  fetchMyAttendances: async (params) => {
    set({ loading: true, error: null })
    try {
      const res = await getMyAttendances(params)
      set({ attendances: res, loading: false })
    } catch (err) {
      set({ error: err?.response?.data || err?.message, loading: false })
    }
  },

  createAttendance: async (data) => {
    try {
      await createAttendance(data)
    } catch (err) {
      set({ error: err?.response?.data || err?.message })
    }
  },

  updateAttendance: async (id, data) => {
    try {
      await updateAttendance(id, data)
    } catch (err) {
      set({ error: err?.response?.data || err?.message })
    }
  },

  deleteAttendance: async (id) => {
    try {
      await deleteAttendance(id)
    } catch (err) {
      set({ error: err?.response?.data || err?.message })
    }
  },

  clearError: () => set({ error: null })
}))

export default useAttendanceStore
