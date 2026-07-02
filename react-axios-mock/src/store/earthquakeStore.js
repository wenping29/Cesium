import { create } from 'zustand'
import { getEarthquakes } from '../api/earthquake'

const useEarthquakeStore = create((set) => ({
  earthquakes: [],
  loading: false,
  visible: false,
  heatmapVisible: false,
  heatmapOpacity: 0.6,
  heatmapRadius: 30,
  fetchEarthquakes: async (params) => {
    set({ loading: true })
    try {
      const res = await getEarthquakes(params)
      set({ earthquakes: res.data, loading: false })
    } catch {
      set({ loading: false })
    }
  },
  setVisible: (visible) => set({ visible }),
  setHeatmapVisible: (heatmapVisible) => set({ heatmapVisible }),
  setHeatmapOpacity: (heatmapOpacity) => set({ heatmapOpacity }),
  setHeatmapRadius: (heatmapRadius) => set({ heatmapRadius }),
}))

export default useEarthquakeStore
