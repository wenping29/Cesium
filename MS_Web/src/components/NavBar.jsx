import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AppBar, Toolbar, Typography, Button, Box, Avatar,
  Popper, Paper, Grow, MenuList, MenuItem, ListItemIcon, ListItemText, Divider,
  IconButton
} from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import PersonIcon from '@mui/icons-material/Person'
import LockIcon from '@mui/icons-material/Lock'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useTranslation } from 'react-i18next'
import useAuthStore from '../store/authStore'
import sidebarStore from '../store/sidebarStore'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeSwitcher from './ThemeSwitcher'
import Breadcrumb from './Breadcrumb'

export default function NavBar() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { open: sidebarOpen, toggle: toggleSidebar } = sidebarStore()
  const [open, setOpen] = useState(false)
  const timerRef = useRef(null)
  const containerRef = useRef(null)

  const show = useCallback(() => { clearTimeout(timerRef.current); setOpen(true) }, [])
  const hide = useCallback(() => { timerRef.current = setTimeout(() => setOpen(false), 200) }, [])

  const handleLogout = async () => {
    setOpen(false)
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <AppBar position="static" sx={{ zIndex: 1201, height: 48 }}>
      <Toolbar sx={{ minHeight: 48 }}>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={toggleSidebar} color="inherit" size="small">
            {sidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
          <Breadcrumb />
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
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
