import { create } from 'zustand'
import { getHexGridCells } from '../api/hexgrid'

const useHexGridStore = create((set) => ({
  cells: [],
  geoJSON: null,
  loading: false,
  visible: true,
  opacity: 0.6,
  color: '#4a90e2',

  fetchCells: async () => {
    set({ loading: true })
    try {
      const res = await getHexGridCells()
      set({ cells: res.data.cells, loading: false })
    } catch (err) {
      console.error('Failed to fetch hex grid cells:', err)
      set({ loading: false })
    }
  },

  setVisible: (visible) => set({ visible }),
  setOpacity: (opacity) => set({ opacity }),
  setColor: (color) => set({ color }),
}))

export default useHexGridStore
