import { create } from 'zustand'
import { getMenus, getAllMenus, createMenu, updateMenu, deleteMenu } from '../api/menu'

const useMenuStore = create((set) => ({
  menus: [],
  allMenus: [],
  loading: false,
  error: null,

  fetchMenus: async () => {
    set({ loading: true, error: null })
    try {
      const res = await getMenus()
      set({ menus: res, loading: false })
    } catch (err) {
      set({ error: err?.response?.data?.title || err?.response?.data || err?.message, loading: false })
    }
  },

  fetchAllMenus: async () => {
    set({ loading: true, error: null })
    try {
      const res = await getAllMenus()
      set({ allMenus: res, loading: false })
    } catch (err) {
      set({ error: err?.response?.data?.title || err?.response?.data || err?.message, loading: false })
    }
  },

  createMenu: async (data) => {
    try {
      await createMenu(data)
      const res = await getAllMenus()
      set({ allMenus: res })
    } catch (err) {
      set({ error: err?.response?.data?.title || err?.response?.data || err?.message })
    }
  },

  updateMenu: async (id, data) => {
    try {
      await updateMenu(id, data)
      const res = await getAllMenus()
      set({ allMenus: res })
    } catch (err) {
      set({ error: err?.response?.data?.title || err?.response?.data || err?.message })
    }
  },

  deleteMenu: async (id) => {
    try {
      await deleteMenu(id)
      const res = await getAllMenus()
      set({ allMenus: res })
    } catch (err) {
      set({ error: err?.response?.data?.title || err?.response?.data || err?.message })
    }
  },
}))

export default useMenuStore
