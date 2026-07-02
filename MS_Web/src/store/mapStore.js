import { create } from 'zustand'
import { getCities, getLandmarks } from '../api/cesium'

const useMapStore = create((set) => ({
  cities: [],
  landmarks: [],
  loading: false,

  fetchGeoData: async () => {
    set({ loading: true })
    try {
      const [citiesRes, landmarksRes] = await Promise.all([getCities(), getLandmarks()])
      set({ cities: citiesRes.data, landmarks: landmarksRes.data, loading: false })
    } catch (err) {
      console.error(err)
      set({ loading: false })
    }
  },
}))

export default useMapStore
