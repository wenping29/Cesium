import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  CircularProgress,
  Alert,
  Paper,
  TableContainer,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Divider,
  Avatar
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

const typeConfig = {
  system: { icon: <SystemUpdateIcon />, color: 'info' },
  task: { icon: <AssignmentIcon />, color: 'warning' },
  message: { icon: <ChatIcon />, color: 'success' }
}

const typeOptions = [
  { value: 'system', label: '系统通知' },
  { value: 'task', label: '任务通知' },
  { value: 'message', label: '普通消息' }
]

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
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterReadStatus, setFilterReadStatus] = useState('')
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('')
  const [appliedFilterType, setAppliedFilterType] = useState('')
  const [appliedFilterReadStatus, setAppliedFilterReadStatus] = useState('')

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

  const handleSearch = () => {
    setAppliedSearchQuery(searchQuery)
    setAppliedFilterType(filterType)
    setAppliedFilterReadStatus(filterReadStatus)
  }

  const handleReset = () => {
    setSearchQuery('')
    setFilterType('')
    setFilterReadStatus('')
    setAppliedSearchQuery('')
    setAppliedFilterType('')
    setAppliedFilterReadStatus('')
  }

  const filteredNotifications = notifications.filter(n => {
    const matchesSearch = !appliedSearchQuery ||
      n.title?.toLowerCase().includes(appliedSearchQuery.toLowerCase()) ||
      n.content?.toLowerCase().includes(appliedSearchQuery.toLowerCase())
    const matchesType = !appliedFilterType || n.type === appliedFilterType
    const matchesReadStatus = appliedFilterReadStatus === '' ||
      (appliedFilterReadStatus === 'read' && n.read) ||
      (appliedFilterReadStatus === 'unread' && !n.read)
    return matchesSearch && matchesType && matchesReadStatus
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
    if (window.confirm(t('confirmDelete'))) {
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

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          {unreadCount > 0 && (
            <Chip
              label={`${unreadCount} 未读`}
              color="primary"
              size="small"
            />
          )}
          <TextField
            label={t('common.search')}
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="通知标题"
            sx={{ minWidth: 200 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>通知类型</InputLabel>
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              label="通知类型"
            >
              <MenuItem value="">{t('common.all')}</MenuItem>
              {typeOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>阅读状态</InputLabel>
            <Select
              value={filterReadStatus}
              onChange={(e) => setFilterReadStatus(e.target.value)}
              label="阅读状态"
            >
              <MenuItem value="">{t('common.all')}</MenuItem>
              <MenuItem value="read">已读</MenuItem>
              <MenuItem value="unread">未读</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleSearch}>
            {t('common.search')}
          </Button>
          <Button onClick={handleReset}>
            {t('common.reset')}
          </Button>
        </Box>
        {unreadCount > 0 && (
          <Button
            startIcon={<MarkReadIcon />}
            onClick={handleMarkAllAsRead}
          >
            全部标为已读
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
          <Button size="small" onClick={fetchNotifications} sx={{ ml: 1 }}>
            重试
          </Button>
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ height: 600 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>类型</TableCell>
                <TableCell>标题</TableCell>
                <TableCell>内容</TableCell>
                <TableCell>发送人</TableCell>
                <TableCell>时间</TableCell>
                <TableCell>状态</TableCell>
                <TableCell align="center">{t('userManagement.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredNotifications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                      <NotificationsIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        暂无通知消息
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filteredNotifications.map((notification) => {
                  const typeInfo = typeConfig[notification.type] || typeConfig.system
                  return (
                    <TableRow key={notification.id} hover sx={{ cursor: 'pointer', bgcolor: notification.read ? 'transparent' : 'action.hover', height: 48 }}>
                      <TableCell onClick={() => handleNotificationClick(notification)} sx={{ height: 48, py: 0 }}>{notification.id}</TableCell>
                      <TableCell onClick={() => handleNotificationClick(notification)} sx={{ height: 48, py: 0 }}>
                        <Chip
                          icon={typeInfo.icon}
                          label={typeOptions.find(o => o.value === notification.type)?.label || notification.type}
                          size="small"
                          color={typeInfo.color}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell onClick={() => handleNotificationClick(notification)} sx={{ height: 48, py: 0, fontWeight: notification.read ? 'normal' : 'bold' }}>
                        {notification.title}
                      </TableCell>
                      <TableCell onClick={() => handleNotificationClick(notification)} sx={{ height: 48, py: 0 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 300,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {notification.content}
                        </Typography>
                      </TableCell>
                      <TableCell onClick={() => handleNotificationClick(notification)} sx={{ height: 48, py: 0 }}>{notification.sender}</TableCell>
                      <TableCell onClick={() => handleNotificationClick(notification)} sx={{ height: 48, py: 0 }}>{getRelativeTime(notification.date)}</TableCell>
                      <TableCell onClick={() => handleNotificationClick(notification)} sx={{ height: 48, py: 0 }}>
                        <Chip
                          label={notification.read ? '已读' : '未读'}
                          size="small"
                          color={notification.read ? 'default' : 'primary'}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ height: 48, py: 0 }}>
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                          {!notification.read && (
                            <Tooltip title="标记为已读">
                              <IconButton
                                size="small"
                                onClick={(e) => { e.stopPropagation(); handleMarkAsRead(notification.id); }}
                              >
                                <MarkReadIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title={t('common.delete')}>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={(e) => { e.stopPropagation(); handleDeleteNotification(notification.id); }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
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
                  <Avatar sx={{ bgcolor: `${selectedNotification.color || 'primary'}.main` }}>
                    {iconMap[selectedNotification.icon] || <NotificationsIcon />}
                  </Avatar>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {selectedNotification.sender}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.disabled">
                        {selectedNotification.date}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {selectedNotification.detail || selectedNotification.content}
              </Typography>
            </DialogContent>
            <DialogActions>
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
