import { create } from 'zustand'
import { getAirQuality } from '../api/airquality'

const useAirQualityStore = create((set) => ({
  stations: [],
  loading: false,
  visible: false,
  fetchAirQuality: async () => {
    set({ loading: true })
    try {
      const res = await getAirQuality()
      set({ stations: res.data, loading: false })
    } catch {
      set({ loading: false })
    }
  },
  setVisible: (visible) => set({ visible }),
}))

export default useAirQualityStore
