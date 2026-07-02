import { create } from 'zustand'
import { getDepartments, getAllDepartments, createDepartment, updateDepartment, deleteDepartment } from '../api/department'

const useDepartmentStore = create((set) => ({
  departments: [],
  allDepartments: [],
  loading: false,
  error: null,

  fetchDepartments: async () => {
    set({ loading: true, error: null })
    try {
      const res = await getDepartments()
      set({ departments: res, loading: false })
    } catch (err) {
      set({ error: err?.response?.data || err?.message, loading: false })
    }
  },

  fetchAllDepartments: async () => {
    set({ loading: true, error: null })
    try {
      const res = await getAllDepartments()
      set({ allDepartments: res, loading: false })
    } catch (err) {
      set({ error: err?.response?.data || err?.message, loading: false })
    }
  },

  createDepartment: async (data) => {
    try {
      await createDepartment(data)
      const res = await getAllDepartments()
      set({ allDepartments: res })
    } catch (err) {
      set({ error: err?.response?.data || err?.message })
    }
  },

  updateDepartment: async (id, data) => {
    try {
      await updateDepartment(id, data)
      const res = await getAllDepartments()
      set({ allDepartments: res })
    } catch (err) {
      set({ error: err?.response?.data || err?.message })
    }
  },

  deleteDepartment: async (id) => {
    try {
      await deleteDepartment(id)
      const res = await getAllDepartments()
      set({ allDepartments: res })
    } catch (err) {
      set({ error: err?.response?.data || err?.message })
    }
  },
}))

export default useDepartmentStore
