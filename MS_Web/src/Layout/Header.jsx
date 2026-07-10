import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AppBar, Toolbar, Typography, Button, Box, Avatar,
  Popper, Paper, Grow, MenuList, MenuItem, ListItemIcon, ListItemText, Divider,
  IconButton, Badge, List, ListItem, ListItemAvatar, ListItemButton
} from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import PersonIcon from '@mui/icons-material/Person'
import LockIcon from '@mui/icons-material/Lock'
import MenuIcon from '@mui/icons-material/Menu'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import NotificationsIcon from '@mui/icons-material/Notifications'
import SystemUpdateIcon from '@mui/icons-material/SystemUpdate'
import AssignmentIcon from '@mui/icons-material/Assignment'
import EventIcon from '@mui/icons-material/Event'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import ChatIcon from '@mui/icons-material/Chat'
import { useTranslation } from 'react-i18next'
import useAuthStore from '../store/authStore'
import sidebarStore from '../store/sidebarStore'
import LanguageSwitcher from '../components/header/LanguageSwitcher'
import ThemeSwitcher from '../components/header/ThemeSwitcher'
import Breadcrumb from '../components/header/Breadcrumb'
import { getUnreadCount, getNotifications } from '../api/notification'

const iconMap = {
  SystemUpdate: <SystemUpdateIcon />,
  Assignment: <AssignmentIcon />,
  Event: <EventIcon />,
  PersonAdd: <PersonAddIcon />,
  Chat: <ChatIcon />
}

const getRelativeTime = (dateStr) => {
  const date = new Date(dateStr.replace(' ', 'T'))
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return dateStr
}

export default function NavBar() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { open: sidebarOpen, toggle: toggleSidebar } = sidebarStore()
  const [open, setOpen] = useState(false)
  const [openNotifications, setOpenNotifications] = useState(false)
  const timerRef = useRef(null)
  const containerRef = useRef(null)
  const notificationsAnchorRef = useRef(null)

  const [notificationCount, setNotificationCount] = useState(0)
  const [unreadNotifications, setUnreadNotifications] = useState([])

  // 获取未读通知数量和列表
  const fetchNotifications = async () => {
    try {
      const data = await getNotifications()
      const unread = data.filter(n => !n.read)
      setNotificationCount(unread.length)
      setUnreadNotifications(unread.slice(0, 5)) // 只显示最新的5条
    } catch (err) {
      console.error('Failed to fetch notifications:', err)
    }
  }

  useEffect(() => {
    if (user) {
      fetchNotifications()
      // 每30秒刷新一次
      const interval = setInterval(fetchNotifications, 30000)
      return () => clearInterval(interval)
    }
  }, [user])

  const show = useCallback(() => { clearTimeout(timerRef.current); setOpen(true) }, [])
  const hide = useCallback(() => { timerRef.current = setTimeout(() => setOpen(false), 200) }, [])

  const showNotifications = useCallback(() => { clearTimeout(timerRef.current); setOpenNotifications(true) }, [])
  const hideNotifications = useCallback(() => { timerRef.current = setTimeout(() => setOpenNotifications(false), 200) }, [])

  const handleLogout = async () => {
    setOpen(false)
    await logout()
    navigate('/login', { replace: true })
  }

  const handleNotificationsClick = () => {
    setOpenNotifications(false)
    navigate('/notifications')
  }

  const handleNotificationClick = (notification) => {
    setOpenNotifications(false)
    navigate('/notifications')
  }

  return (
    <AppBar position="static" sx={{ zIndex: 1201, height: 64 }}>
      <Toolbar sx={{ minHeight: 48 }}>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 0 }}>
          <IconButton onClick={toggleSidebar} color="inherit" size="small">
            {sidebarOpen ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>
          <Breadcrumb />
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Box sx={{ position: 'relative' }}>
            <IconButton
              ref={notificationsAnchorRef}
              color="inherit"
              onClick={handleNotificationsClick}
              onMouseEnter={showNotifications}
              onMouseLeave={hideNotifications}
            >
              <Badge badgeContent={notificationCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            {/* 通知悬浮列表 */}
            <Popper
              open={openNotifications}
              anchorEl={notificationsAnchorRef.current}
              placement="bottom-end"
              transition
              disablePortal
              style={{ zIndex: 1300 }}
            >
              {({ TransitionProps }) => (
                <Grow {...TransitionProps} timeout={200}>
                  <Paper
                    onMouseEnter={showNotifications}
                    onMouseLeave={hideNotifications}
                    sx={{
                      mt: 1,
                      minWidth: 320,
                      maxHeight: 400,
                      overflow: 'auto',
                      borderRadius: 1
                    }}
                  >
                    <Box sx={{
                      p: 2,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom: 1,
                      borderColor: 'divider'
                    }}>
                      <Typography variant="h6">{t('nav.notifications')}</Typography>
                      {notificationCount > 0 && (
                        <Button
                          size="small"
                          onClick={handleNotificationsClick}
                        >
                          查看全部
                        </Button>
                      )}
                    </Box>
                    {unreadNotifications.length === 0 ? (
                      <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography color="text.secondary">
                          暂无未读通知
                        </Typography>
                      </Box>
                    ) : (
                      <List>
                        {unreadNotifications.map((notification, index) => (
                          <div key={notification.id}>
                            {index > 0 && <Divider />}
                            <ListItemButton
                              onClick={() => handleNotificationClick(notification)}
                              sx={{ px: 2 }}
                            >
                              <ListItemAvatar>
                                <Avatar sx={{ bgcolor: `${notification.color}.main`, width: 32, height: 32 }}>
                                  {iconMap[notification.icon] || <NotificationsIcon />}
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="body2" fontWeight="bold" sx={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                      {notification.title}
                                    </Typography>
                                    <Box
                                      sx={{
                                        width: 6,
                                        height: 6,
                                        borderRadius: '50%',
                                        bgcolor: 'primary.main',
                                        flexShrink: 0
                                      }}
                                    />
                                  </Box>
                                }
                                secondary={
                                  <Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                      {notification.content}
                                    </Typography>
                                    <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block' }}>
                                      {getRelativeTime(notification.date)}
                                    </Typography>
                                  </Box>
                                }
                              />
                            </ListItemButton>
                          </div>
                        ))}
                      </List>
                    )}
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
