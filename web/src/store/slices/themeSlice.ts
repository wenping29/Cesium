import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type ThemeName = 'light-blue' | 'dark-blue' | 'light-green' | 'light-orange' | 'light-red'

const validThemes: ThemeName[] = ['light-blue', 'dark-blue', 'light-green', 'light-orange', 'light-red']

function getInitialTheme(): ThemeName {
  const saved = localStorage.getItem('themeName')
  if (saved && (validThemes as string[]).includes(saved)) {
    return saved as ThemeName
  }
  const old = localStorage.getItem('themeMode')
  if (old === 'dark') return 'dark-blue'
  return 'light-blue'
}

interface ThemeState {
  themeName: ThemeName
}

const initialState: ThemeState = {
  themeName: getInitialTheme(),
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeName>) => {
      state.themeName = action.payload
      localStorage.setItem('themeName', action.payload)
    },
  },
})

export const { setTheme } = themeSlice.actions
export default themeSlice.reducer
