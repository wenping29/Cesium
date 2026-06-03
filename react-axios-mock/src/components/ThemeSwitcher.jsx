import { useState, useRef, useCallback } from 'react'
import { Button, Popper, Paper, Grow, MenuList, MenuItem, Box } from '@mui/material'
import PaletteIcon from '@mui/icons-material/Palette'
import { useTranslation } from 'react-i18next'
import useThemeStore from '../store/themeStore'

const themes = ['light', 'dark', 'ocean', 'forest', 'sunset', 'midnight']

const themeColors = {
  light: '#1976d2',
  dark: '#90caf9',
  ocean: '#00695c',
  forest: '#2e7d32',
  sunset: '#e65100',
  midnight: '#7c4dff',
}

export default function ThemeSwitcher() {
  const { t } = useTranslation()
  const { themeName, setTheme } = useThemeStore()
  const [open, setOpen] = useState(false)
  const anchorRef = useRef(null)
  const timerRef = useRef(null)

  const show = useCallback(() => { clearTimeout(timerRef.current); setOpen(true) }, [])
  const hide = useCallback(() => { timerRef.current = setTimeout(() => setOpen(false), 200) }, [])

  return (
    <div ref={anchorRef} onMouseEnter={show} onMouseLeave={hide} style={{ display: 'inline-block' }}>
      <Button color="inherit" size="small" startIcon={<PaletteIcon />}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: themeColors[themeName], display: 'inline-block' }} />
          {t(`theme.${themeName}`)}
        </Box>
      </Button>
      <Popper open={open} anchorEl={anchorRef.current} placement="bottom-end" transition disablePortal style={{ zIndex: 1300 }}>
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} timeout={200}>
            <Paper onMouseEnter={show} onMouseLeave={hide} sx={{ mt: 1, minWidth: 140 }}>
              <MenuList dense>
                {themes.map((tName) => (
                  <MenuItem key={tName} selected={themeName === tName} onClick={() => setTheme(tName)}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: themeColors[tName] }} />
                      {t(`theme.${tName}`)}
                    </Box>
                  </MenuItem>
                ))}
              </MenuList>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  )
}
