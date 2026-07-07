import { create } from 'zustand'

const sidebarStore = create((set) => ({
  open: true,

  toggle: () => set((state) => ({ open: !state.open })),

  setOpen: (open) => set({ open }),
}))

export default sidebarStore