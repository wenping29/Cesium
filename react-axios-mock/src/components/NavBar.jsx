import { useState, useRef, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  AppBar, Toolbar, Typography, Button, Box, Avatar,
  Popper, Paper, Grow, MenuList, MenuItem, ListItemIcon, ListItemText, Divider,
} from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import MapIcon from '@mui/icons-material/Map'
import LayersIcon from '@mui/icons-material/Layers'
import MapOutlinedIcon from '@mui/icons-material/MapOutlined'
import DashboardIcon from '@mui/icons-material/Dashboard'
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows'
import TableChartIcon from '@mui/icons-material/TableChart'
import VolcanoIcon from '@mui/icons-material/Volcano'
import StormIcon from '@mui/icons-material/Storm'
import WavesIcon from '@mui/icons-material/Waves'
import AirIcon from '@mui/icons-material/Air'
import LogoutIcon from '@mui/icons-material/Logout'
import PersonIcon from '@mui/icons-material/Person'
import LockIcon from '@mui/icons-material/Lock'
import { useTranslation } from 'react-i18next'
import useAuthStore from '../store/authStore'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeSwitcher from './ThemeSwitcher'

export default function NavBar() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const [open, setOpen] = useState(false)
  const [dataMenuOpen, setDataMenuOpen] = useState(false)
  const timerRef = useRef(null)
  const containerRef = useRef(null)
  const dataMenuRef = useRef(null)

  const show = useCallback(() => { clearTimeout(timerRef.current); setOpen(true) }, [])
  const hide = useCallback(() => { timerRef.current = setTimeout(() => setOpen(false), 200) }, [])

  const showDataMenu = useCallback(() => { clearTimeout(timerRef.current); setDataMenuOpen(true) }, [])
  const hideDataMenu = useCallback(() => { timerRef.current = setTimeout(() => setDataMenuOpen(false), 200) }, [])

  const handleLogout = async () => {
    setOpen(false)
    await logout()
    navigate('/login', { replace: true })
  }

  const navItems = [
    { label: t('nav.dashboard'), path: '/dashboard', icon: <DashboardIcon sx={{ mr: 0.5 }} /> },
    { label: t('nav.bigScreen'), path: '/big-screen', icon: <DesktopWindowsIcon sx={{ mr: 0.5 }} /> },
    { label: t('nav.map'), path: '/map', icon: <MapIcon sx={{ mr: 0.5 }} /> },
    { label: t('nav.olMap'), path: '/openlayer-map', icon: <LayersIcon sx={{ mr: 0.5 }} /> },
    { label: t('nav.leafletMap'), path: '/leaflet-map', icon: <MapOutlinedIcon sx={{ mr: 0.5 }} /> },
  ]

  const dataTableItems = [
    { label: t('earthquakeTable.title'), path: '/earthquake-table', icon: <VolcanoIcon fontSize="small" /> },
    { label: t('typhoonTable.title'), path: '/typhoon-table', icon: <StormIcon fontSize="small" /> },
    { label: t('windTable.title'), path: '/wind-table', icon: <WavesIcon fontSize="small" /> },
    { label: t('airQualityTable.title'), path: '/airquality-table', icon: <AirIcon fontSize="small" /> },
  ]

  return (
    <AppBar position="static" sx={{ zIndex: 1201 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
          {t('nav.appTitle')}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              startIcon={item.icon}
              onClick={() => navigate(item.path)}
              sx={{
                bgcolor: location.pathname === item.path ? 'rgba(255,255,255,0.15)' : 'transparent',
              }}
            >
              {item.label}
            </Button>
          ))}

          <Box
            ref={dataMenuRef}
            onMouseEnter={showDataMenu}
            onMouseLeave={hideDataMenu}
          >
            <Button
              color="inherit"
              startIcon={<TableChartIcon sx={{ mr: 0.5 }} />}
              sx={{
                bgcolor: dataTableItems.some((i) => location.pathname === i.path) ? 'rgba(255,255,255,0.15)' : 'transparent',
              }}
            >
              {t('nav.dataTables')}
            </Button>
            <Popper
              open={dataMenuOpen}
              anchorEl={dataMenuRef.current}
              placement="bottom-start"
              transition
              disablePortal
              style={{ zIndex: 1300 }}
            >
              {({ TransitionProps }) => (
                <Grow {...TransitionProps} timeout={200}>
                  <Paper onMouseEnter={showDataMenu} onMouseLeave={hideDataMenu} sx={{ mt: 1, minWidth: 180 }}>
                    <MenuList dense>
                      {dataTableItems.map((item) => (
                        <MenuItem
                          key={item.path}
                          onClick={() => { setDataMenuOpen(false); navigate(item.path) }}
                          selected={location.pathname === item.path}
                        >
                          <ListItemIcon>{item.icon}</ListItemIcon>
                          <ListItemText>{item.label}</ListItemText>
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </Box>

          <ThemeSwitcher />
          <LanguageSwitcher />

          <Box
            ref={containerRef}
            onMouseEnter={show}
            onMouseLeave={hide}
            sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1, pl: 2, borderLeft: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}
          >
            <Avatar src={user?.avatar} sx={{ width: 28, height: 28 }} />
            <Typography variant="body2">{user?.name}</Typography>

            <Popper
              open={open}
              anchorEl={containerRef.current}
              placement="bottom-end"
              transition
              disablePortal
              style={{ zIndex: 1300 }}
            >
              {({ TransitionProps }) => (
                <Grow {...TransitionProps} timeout={200}>
                  <Paper onMouseEnter={show} onMouseLeave={hide} sx={{ mt: 1, minWidth: 160 }}>
                    <MenuList dense>
                      <MenuItem onClick={() => { setOpen(false); navigate('/profile') }}>
                        <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                        <ListItemText>{t('nav.editProfile')}</ListItemText>
                      </MenuItem>
                      <MenuItem onClick={() => { setOpen(false); navigate('/change-password') }}>
                        <ListItemIcon><LockIcon fontSize="small" /></ListItemIcon>
                        <ListItemText>{t('nav.changePassword')}</ListItemText>
                      </MenuItem>
                      <Divider />
                      <MenuItem onClick={handleLogout}>
                        <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                        <ListItemText>{t('nav.logout')}</ListItemText>
                      </MenuItem>
                    </MenuList>
                  </Paper>
                </Grow>
              )}
            </Popper>

            <Button color="inherit" size="small" startIcon={<LogoutIcon />} onClick={handleLogout}>
              {t('nav.logout')}
            </Button>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
