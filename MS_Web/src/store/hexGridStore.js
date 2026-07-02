import { create } from 'zustand'
import { getHexGridCells } from '../api/hexgrid'

const useHexGridStore = create((set, get) => ({
  cells: [],
  geoJSON: null,
  loading: false,
  visible: false,
  opacity: 0.6,
  color: '#4a90e2',
  cellSizeKm: 5,

  fetchCells: async (cellSizeKm) => {
    const size = cellSizeKm ?? get().cellSizeKm
    set({ loading: true, cellSizeKm: size })
    try {
      const res = await getHexGridCells(size)
      set({ cells: res.data.cells, loading: false })
    } catch (err) {
      console.error('Failed to fetch hex grid cells:', err)
      set({ loading: false })
    }
  },

  setVisible: (visible) => set({ visible }),
  setOpacity: (opacity) => set({ opacity }),
  setColor: (color) => set({ color }),

  setCellSizeKm: (cellSizeKm) => {
    set({ cellSizeKm })
    get().fetchCells(cellSizeKm)
  },
}))

export default useHexGridStore
