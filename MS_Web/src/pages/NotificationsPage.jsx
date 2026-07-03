import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  IconButton,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Badge,
  Tabs,
  Tab,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert
} from '@mui/material'
import {
  Notifications as NotificationsIcon,
  MarkEmailRead as MarkReadIcon,
  Delete as DeleteIcon,
  SystemUpdate as SystemUpdateIcon,
  Assignment as AssignmentIcon,
  Event as EventIcon,
  PersonAdd as PersonAddIcon,
  Chat as ChatIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  CalendarToday as CalendarTodayIcon
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
} from '../api/notification'

const notificationTypes = {
  all: 'all',
  unread: 'unread',
  system: 'system',
  task: 'task',
  message: 'message'
}

const iconMap = {
  SystemUpdate: <SystemUpdateIcon />,
  Assignment: <AssignmentIcon />,
  Event: <EventIcon />,
  PersonAdd: <PersonAddIcon />,
  Chat: <ChatIcon />
}

// 计算相对时间
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

export default function NotificationsPage() {
  const { t } = useTranslation()
  const [notifications, setNotifications] = useState([])
  const [activeFilter, setActiveFilter] = useState(notificationTypes.all)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 从API加载通知
  const fetchNotifications = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getNotifications()
      setNotifications(data)
    } catch (err) {
      console.error('Failed to fetch notifications:', err)
      setError('加载通知失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === notificationTypes.all) return true
    if (activeFilter === notificationTypes.unread) return !n.read
    return n.type === activeFilter
  })

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id)
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      ))
    } catch (err) {
      console.error('Failed to mark as read:', err)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead()
      setNotifications(notifications.map(n => ({ ...n, read: true })))
    } catch (err) {
      console.error('Failed to mark all as read:', err)
    }
  }

  const handleDeleteNotification = async (id) => {
    try {
      await deleteNotification(id)
      setNotifications(notifications.filter(n => n.id !== id))
      if (selectedNotification?.id === id) {
        handleCloseDialog()
      }
    } catch (err) {
      console.error('Failed to delete notification:', err)
    }
  }

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification)
    setOpenDialog(true)
    if (!notification.read) {
      handleMarkAsRead(notification.id)
    }
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedNotification(null)
  }

  const getFilterOptions = () => [
    { value: notificationTypes.all, label: t('notifications.filters.all') },
    { value: notificationTypes.unread, label: t('notifications.filters.unread') },
    { value: notificationTypes.system, label: t('notifications.filters.system') },
    { value: notificationTypes.task, label: t('notifications.filters.task') },
    { value: notificationTypes.message, label: t('notifications.filters.message') }
  ]

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {unreadCount > 0 && (
            <Chip
              label={`${unreadCount} ${t('notifications.unread')}`}
              color="primary"
              size="small"
            />
          )}
        </Box>
        {unreadCount > 0 && (
          <Button
            startIcon={<MarkReadIcon />}
            onClick={handleMarkAllAsRead}
            size="small"
          >
            {t('notifications.markAllRead')}
          </Button>
        )}
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
          <Button size="small" onClick={fetchNotifications} sx={{ ml: 1 }}>
            重试
          </Button>
        </Alert>
      )}

      {/* Filter Tabs */}
      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={activeFilter}
          onChange={(_, newValue) => setActiveFilter(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {getFilterOptions().map(option => (
            <Tab
              key={option.value}
              value={option.value}
              label={
                option.value === notificationTypes.unread
                  ? `${option.label} (${unreadCount})`
                  : option.label
              }
            />
          ))}
        </Tabs>
      </Paper>

      {/* Notifications List */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <CircularProgress />
            </Box>
          ) : filteredNotifications.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <NotificationsIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                {t('notifications.noNotifications')}
              </Typography>
            </Box>
          ) : (
            <List>
              {filteredNotifications.map((notification, index) => (
                <div key={notification.id}>
                  {index > 0 && <Divider />}
                  <ListItem
                    disablePadding
                    sx={{
                      bgcolor: notification.read ? 'transparent' : 'action.hover'
                    }}
                  >
                    <ListItemButton
                      onClick={() => handleNotificationClick(notification)}
                      sx={{ py: 2 }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: `${notification.color}.main` }}>
                          {iconMap[notification.icon] || <NotificationsIcon />}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1" fontWeight={notification.read ? 'normal' : 'bold'}>
                              {notification.title}
                            </Typography>
                            {!notification.read && (
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  bgcolor: 'primary.main'
                                }}
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              {notification.content}
                            </Typography>
                            <Typography variant="caption" color="text.disabled" sx={{ mt: 1, display: 'block' }}>
                              {getRelativeTime(notification.date)}
                            </Typography>
                          </Box>
                        }
                      />
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {!notification.read && (
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={(e) => { e.stopPropagation(); handleMarkAsRead(notification.id); }}
                            title={t('notifications.markRead')}
                          >
                            <MarkReadIcon fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={(e) => { e.stopPropagation(); handleDeleteNotification(notification.id); }}
                          title={t('notifications.delete')}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </ListItemButton>
                  </ListItem>
                </div>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Notification Detail Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        {selectedNotification && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">{selectedNotification.title}</Typography>
              <IconButton onClick={handleCloseDialog} size="small">
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ pt: 2 }}>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Avatar sx={{ bgcolor: `${selectedNotification.color}.main` }}>
                    {iconMap[selectedNotification.icon] || <NotificationsIcon />}
                  </Avatar>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {selectedNotification.sender}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.disabled">
                        {selectedNotification.date}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {selectedNotification.detail}
              </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button onClick={handleCloseDialog}>
                关闭
              </Button>
              {!selectedNotification.read && (
                <Button
                  variant="contained"
                  onClick={() => {
                    handleMarkAsRead(selectedNotification.id);
                    handleCloseDialog();
                  }}
                >
                  标记为已读
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  )
}
