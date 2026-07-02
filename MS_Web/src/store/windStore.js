import { create } from 'zustand'
import { getWindData } from '../api/wind'

const useWindStore = create((set) => ({
  windData: [],
  loading: false,
  visible: false,
  fetchWind: async () => {
    set({ loading: true })
    try {
      const res = await getWindData()
      set({ windData: res.data, loading: false })
    } catch {
      set({ loading: false })
    }
  },
  setVisible: (visible) => set({ visible }),
}))

export default useWindStore
