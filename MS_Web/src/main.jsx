import { StrictMode, useMemo } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import './index.css'
import './i18n'
import './mock'
import useThemeStore from './store/themeStore'
import App from './App.jsx'

const themes = {
  light: {
    palette: { mode: 'light', primary: { main: '#1976d2' }, secondary: { main: '#9c27b0' } },
  },
  dark: {
    palette: { mode: 'dark', primary: { main: '#90caf9' }, secondary: { main: '#ce93d8' }},
  },
  ocean: {
    palette: { mode: 'light', primary: { main: '#00695c' }, secondary: { main: '#00897b' } },
  },
  forest: {
    palette: { mode: 'light', primary: { main: '#2e7d32' }, secondary: { main: '#558b2f' } },
  },
  sunset: {
    palette: { mode: 'light', primary: { main: '#e65100' }, secondary: { main: '#f57c00' } },
  },
  midnight: {
    palette: { mode: 'dark', primary: { main: '#7c4dff' }, secondary: { main: '#b388ff'  } },
  },
}

function Root() {
  const themeName = useThemeStore((s) => s.themeName)
  const theme = useMemo(() => createTheme(themes[themeName] || themes.light), [themeName])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Root />
    </BrowserRouter>
  </StrictMode>,
)
