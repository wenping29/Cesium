import { useNavigate, useLocation } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import MapIcon from '@mui/icons-material/Map'
import LogoutIcon from '@mui/icons-material/Logout'
import useAuthStore from '../store/authStore'

const navItems = [
  { label: 'Users', path: '/users', icon: <PeopleIcon sx={{ mr: 0.5 }} /> },
  { label: 'Map', path: '/map', icon: <MapIcon sx={{ mr: 0.5 }} /> },
]

export default function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <AppBar position="static" sx={{ zIndex: 1201 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/users')}>
          React App
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

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2, pl: 2, borderLeft: '1px solid rgba(255,255,255,0.3)' }}>
            <Avatar src={user?.avatar} sx={{ width: 28, height: 28 }} />
            <Typography variant="body2">{user?.name}</Typography>
            <Button color="inherit" size="small" startIcon={<LogoutIcon />} onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
