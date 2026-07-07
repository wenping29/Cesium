import { create } from 'zustand'

const tabStore = create((set, get) => ({
  tabs: [],
  activeTab: null,

  addTab: (path, title, icon) => {
    set((state) => {
      const exists = state.tabs.find((t) => t.path === path)
      if (exists) {
        return { tabs: state.tabs, activeTab: path }
      }
      return {
        tabs: [...state.tabs, { path, title, icon }],
        activeTab: path,
      }
    })
  },

  removeTab: (path) => {
    set((state) => {
      const newTabs = state.tabs.filter((t) => t.path !== path)
      let newActive = state.activeTab
      if (state.activeTab === path) {
        newActive = newTabs.length > 0 ? newTabs[newTabs.length - 1].path : null
      }
      return { tabs: newTabs, activeTab: newActive }
    })
  },

  setActiveTab: (path) => {
    set({ activeTab: path })
  },

  clearAll: () => {
    set({ tabs: [], activeTab: null })
  },
}))

export default tabStore