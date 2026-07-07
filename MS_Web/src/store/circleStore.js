import { create } from 'zustand'

const useCircleStore = create((set, get) => ({
  circles: [],
  visible: false,
  drawingMode: false,
  selectedCircleId: null,

  setVisible: (visible) => set({ visible }),
  setDrawingMode: (drawingMode) => set({ drawingMode }),
  setSelectedCircleId: (id) => set({ selectedCircleId: id }),

  addCircle: (circle) => set((state) => ({
    circles: [...state.circles, { id: Date.now().toString(), ...circle }]
  })),

  updateCircle: (id, updates) => set((state) => ({
    circles: state.circles.map(c => c.id === id ? { ...c, ...updates } : c)
  })),

  deleteCircle: (id) => set((state) => ({
    circles: state.circles.filter(c => c.id !== id),
    selectedCircleId: state.selectedCircleId === id ? null : state.selectedCircleId
  })),

  clearAllCircles: () => set({ circles: [], selectedCircleId: null }),

  toggleCircleVisibility: (id) => set((state) => ({
    circles: state.circles.map(c =>
      c.id === id ? { ...c, visible: !c.visible } : c
    )
  })),
}))

export default useCircleStore
