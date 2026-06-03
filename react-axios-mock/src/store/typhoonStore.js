import { create } from 'zustand'
import { getCurrentTyphoon, getHistoricalTyphoons } from '../api/typhoon'

const useTyphoonStore = create((set) => ({
  current: null,
  historical: [],
  loading: false,
  visible: false,
  fetchCurrent: async () => {
    try {
      const res = await getCurrentTyphoon()
      set({ current: res.data })
    } catch {
      // silent
    }
  },
  fetchHistorical: async () => {
    set({ loading: true })
    try {
      const res = await getHistoricalTyphoons()
      set({ historical: res.data, loading: false })
    } catch {
      set({ loading: false })
    }
  },
  setVisible: (visible) => set({ visible }),
}))

export default useTyphoonStore
