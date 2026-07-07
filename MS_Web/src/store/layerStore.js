import { create } from 'zustand'
import { getLayers as apiGetLayers, createLayer as apiCreateLayer, updateLayer as apiUpdateLayer, deleteLayer as apiDeleteLayer } from '../api/layers'

const useLayerStore = create((set, get) => ({
  layers: [],
  loading: false,

  fetchLayers: async () => {
    console.log('[Store] fetchLayers called')
    set({ loading: true })
    try {
      const res = await apiGetLayers()
      console.log('[Store] fetchLayers response:', res)
      set({ layers: res.data, loading: false })
    } catch (err) {
      console.error('[Store] Failed to fetch layers:', err)
      set({ loading: false })
    }
  },

  toggleLayer: (layerId) => {
    const layers = get().layers.map((l) =>
      l.id === layerId ? { ...l, visible: !l.visible } : l
    )
    set({ layers })
  },

  setLayerOpacity: (layerId, opacity) => {
    const layers = get().layers.map((l) =>
      l.id === layerId ? { ...l, opacity } : l
    )
    set({ layers })
  },

  addLayer: async (data) => {
    try {
      const res = await apiCreateLayer(data)
      const layers = [...get().layers, res.data]
      set({ layers })
      return res.data
    } catch (err) {
      console.error('Failed to create layer:', err)
    }
  },

  updateLayer: async (id, data) => {
    try {
      await apiUpdateLayer(id, data)
      const layers = get().layers.map((l) =>
        l.id === id ? { ...l, ...data } : l
      )
      set({ layers })
    } catch (err) {
      console.error('Failed to update layer:', err)
    }
  },

  removeLayer: async (id) => {
    try {
      await apiDeleteLayer(id)
      const layers = get().layers.filter((l) => l.id !== id)
      set({ layers })
    } catch (err) {
      console.error('Failed to remove layer:', err)
    }
  },

  clearAllLayers: async () => {
    const layers = get().layers
    try {
      await Promise.all(layers.map((l) => apiDeleteLayer(l.id)))
      set({ layers: [] })
    } catch (err) {
      console.error('Failed to clear layers:', err)
    }
  },
}))

export default useLayerStore
