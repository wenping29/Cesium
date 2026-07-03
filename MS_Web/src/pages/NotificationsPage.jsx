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
  Button
} from '@mui/material'
import {
  Notifications as NotificationsIcon,
  MarkEmailRead as MarkReadIcon,
  Delete as DeleteIcon,
  SystemUpdate as SystemUpdateIcon,
  Assignment as AssignmentIcon,
  Event as EventIcon,
  PersonAdd as PersonAddIcon,
  Chat as ChatIcon
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

const notificationTypes = {
  all: 'all',
  unread: 'unread',
  system: 'system',
  task: 'task',
  message: 'message'
}

const mockNotifications = [
  {
    id: 1,
    type: 'system',
    title: '系统更新通知',
    content: '系统将于今晚22:00进行维护升级，请提前保存工作内容。',
    time: '10分钟前',
    read: false,
    icon: <SystemUpdateIcon />,
    color: 'primary'
  },
  {
    id: 2,
    type: 'task',
    title: '收到新任务',
    content: '张三给您分配了一个新任务：完成Q4财务报表。',
    time: '30分钟前',
    read: false,
    icon: <AssignmentIcon />,
    color: 'success'
  },
  {
    id: 3,
    type: 'task',
    title: '任务提醒',
    content: '您的任务"项目规划"将在明天截止，请尽快完成。',
    time: '1小时前',
    read: false,
    icon: <AssignmentIcon />,
    color: 'warning'
  },
  {
    id: 4,
    type: 'system',
    title: '会议提醒',
    content: '下午14:00的周会即将开始，请准时参加。',
    time: '2小时前',
    read: true,
    icon: <EventIcon />,
    color: 'info'
  },
  {
    id: 5,
    type: 'message',
    title: '新消息',
    content: '李四给您发送了一条消息：请问项目进度如何？',
    time: '3小时前',
    read: true,
    icon: <ChatIcon />,
    color: 'secondary'
  },
  {
    id: 6,
    type: 'system',
    title: '新用户注册',
    content: '新用户王五已完成注册，等待审核。',
    time: '4小时前',
    read: true,
    icon: <PersonAddIcon />,
    color: 'info'
  },
  {
    id: 7,
    type: 'task',
    title: '任务已完成',
    content: '您分配给张三的任务已标记为完成，请查看。',
    time: '昨天',
    read: true,
    icon: <AssignmentIcon />,
    color: 'success'
  },
  {
    id: 8,
    type: 'system',
    title: '安全提醒',
    content: '您的账号在新设备上登录，如非本人操作请及时修改密码。',
    time: '2天前',
    read: true,
    icon: <SystemUpdateIcon />,
    color: 'error'
  }
]

export default function NotificationsPage() {
  const { t } = useTranslation()
  const [tabValue, setTabValue] = useState(0)
  const [notifications, setNotifications] = useState(mockNotifications)
  const [activeFilter, setActiveFilter] = useState(notificationTypes.all)

  const unreadCount = notifications.filter(n => !n.read).length

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === notificationTypes.all) return true
    if (activeFilter === notificationTypes.unread) return !n.read
    return n.type === activeFilter
  })

  const markAsRead = (id) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id))
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
          <Typography variant="h4" component="h1">
            {t('notifications.title')}
          </Typography>
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
            onClick={markAllAsRead}
            size="small"
          >
            {t('notifications.markAllRead')}
          </Button>
        )}
      </Box>

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
          {filteredNotifications.length === 0 ? (
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
                      onClick={() => !notification.read && markAsRead(notification.id)}
                      sx={{ py: 2 }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: `${notification.color}.main` }}>
                          {notification.icon}
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
                              {notification.time}
                            </Typography>
                          </Box>
                        }
                      />
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {!notification.read && (
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={(e) => { e.stopPropagation(); markAsRead(notification.id); }}
                            title={t('notifications.markRead')}
                          >
                            <MarkReadIcon fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}
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
    </Box>
  )
}
