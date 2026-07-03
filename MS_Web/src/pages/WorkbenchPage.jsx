import { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Notifications as NotificationsIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Chat as ChatIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import AttendanceCalendar from '../components/AttendanceCalendar'

export default function WorkbenchPage() {
  const { t } = useTranslation()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 6) return t('workbench.greeting.night')
    if (hour < 12) return t('workbench.greeting.morning')
    if (hour < 18) return t('workbench.greeting.afternoon')
    return t('workbench.greeting.evening')
  }

  const quickStats = [
    {
      title: t('workbench.stats.todayVisits'),
      value: '1,234',
      icon: <DashboardIcon sx={{ color: 'primary.main' }} />,
      trend: '+12%'
    },
    {
      title: t('workbench.stats.newUsers'),
      value: '56',
      icon: <PeopleIcon sx={{ color: 'success.main' }} />,
      trend: '+8%'
    },
    {
      title: t('workbench.stats.pendingTasks'),
      value: '12',
      icon: <AssignmentIcon sx={{ color: 'warning.main' }} />,
      trend: '-3%'
    },
    {
      title: t('workbench.stats.messages'),
      value: '28',
      icon: <ChatIcon sx={{ color: 'info.main' }} />,
      trend: '+5%'
    }
  ]

  const notifications = [
    { id: 1, text: t('workbench.notifications.systemUpdate'), time: '5min ago', icon: <NotificationsIcon /> },
    { id: 2, text: t('workbench.notifications.newTask'), time: '1hour ago', icon: <AssignmentIcon /> },
    { id: 3, text: t('workbench.notifications.meetingReminder'), time: '2hours ago', icon: <CalendarIcon /> },
    { id: 4, text: t('workbench.notifications.userRegistered'), time: '3hours ago', icon: <PeopleIcon /> }
  ]

  const recentActivities = [
    { id: 1, user: '张三', action: t('workbench.activities.createdProject'), time: '10min ago' },
    { id: 2, user: '李四', action: t('workbench.activities.updatedFile'), time: '30min ago' },
    { id: 3, user: '王五', action: t('workbench.activities.completedTask'), time: '1hour ago' },
    { id: 4, user: '赵六', action: t('workbench.activities.commented'), time: '2hours ago' }
  ]

  return (
    <Box sx={{ p: 2 }}>
      {/* Header / Welcome */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {getGreeting()}！
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('workbench.welcomeSubtitle')}
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {quickStats.map((stat, index) => (
          <Grid xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'background.paper', width: 56, height: 56 }}>
                  {stat.icon}
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">{stat.title}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h4">{stat.value}</Typography>
                    <Chip
                      label={stat.trend}
                      size="small"
                      color={stat.trend.startsWith('+') ? 'success' : 'default'}
                      sx={{ height: 20 }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Content Grid - Calendar, Notifications, Activities in one row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Attendance Calendar */}
        <Grid xs={12} lg={6}>
          <Card>
            <CardHeader title={t('workbench.attendanceCalendar.title')} />
            <CardContent sx={{ p: 0, pt: 1 }}>
              <AttendanceCalendar />
            </CardContent>
          </Card>
        </Grid>

        {/* Notifications and Recent Activities Column */}
        <Grid xs={12} lg={6} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Notifications */}
          <Card sx={{ flex: 1 }}>
            <CardHeader title={t('workbench.notifications.title')} />
            <Divider />
            <CardContent sx={{ p: 0 }}>
              <List dense>
                {notifications.map((notif) => (
                  <ListItem key={notif.id} divider>
                    <ListItemIcon>{notif.icon}</ListItemIcon>
                    <ListItemText
                      primary={notif.text}
                      secondary={notif.time}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card sx={{ flex: 1 }}>
            <CardHeader title={t('workbench.activities.title')} />
            <Divider />
            <CardContent sx={{ p: 0 }}>
              <List dense>
                {recentActivities.map((activity) => (
                  <ListItem key={activity.id} divider>
                    <ListItemIcon>
                      <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }}>
                        {activity.user.charAt(0)}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight="medium">{activity.user}</Typography>
                        <Typography variant="body2">{activity.action}</Typography>
                      </Box>}
                      secondary={activity.time}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          {t('workbench.quickActions.title')}
        </Typography>
        <Grid container spacing={2}>
          <Grid xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
              <AssignmentIcon sx={{ fontSize: 40, mb: 1, color: 'primary.main' }} />
              <Typography variant="body2">{t('workbench.quickActions.createTask')}</Typography>
            </Paper>
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
              <PeopleIcon sx={{ fontSize: 40, mb: 1, color: 'success.main' }} />
              <Typography variant="body2">{t('workbench.quickActions.inviteUser')}</Typography>
            </Paper>
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
              <ChatIcon sx={{ fontSize: 40, mb: 1, color: 'info.main' }} />
              <Typography variant="body2">{t('workbench.quickActions.startChat')}</Typography>
            </Paper>
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
              <CalendarIcon sx={{ fontSize: 40, mb: 1, color: 'warning.main' }} />
              <Typography variant="body2">{t('workbench.quickActions.viewCalendar')}</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}