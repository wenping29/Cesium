import { create } from 'zustand'

const savedTheme = localStorage.getItem('themeName') || 'light'

const useThemeStore = create((set) => ({
  themeName: savedTheme,
  setTheme: (name) => {
    localStorage.setItem('themeName', name)
    set({ themeName: name })
  },
}))

export default useThemeStore
