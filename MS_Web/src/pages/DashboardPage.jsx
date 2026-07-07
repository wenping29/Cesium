import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box, Typography, Grid, Card, CardContent, CircularProgress,
} from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import ShieldIcon from '@mui/icons-material/Shield'
import BusinessIcon from '@mui/icons-material/Business'
import MenuIcon from '@mui/icons-material/Menu'
import HistoryIcon from '@mui/icons-material/History'
import ScheduleIcon from '@mui/icons-material/Schedule'
import TimerIcon from '@mui/icons-material/Timer'
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage'
import BeachAccessIcon from '@mui/icons-material/BeachAccess'
import { getDashboardStats } from '../api/dashboard'

const cardConfig = [
  { key: 'users', icon: PeopleIcon, labelKey: 'dashboard.users', color: '#1976d2', dataKey: 'users' },
  { key: 'roles', icon: ShieldIcon, labelKey: 'dashboard.roles', color: '#9c27b0', dataKey: 'roles' },
  { key: 'departments', icon: BusinessIcon, labelKey: 'dashboard.departments', color: '#ff9800', dataKey: 'departments' },
  { key: 'menus', icon: MenuIcon, labelKey: 'dashboard.menus', color: '#607d8b', dataKey: 'menus' },
  { key: 'loginLogs', icon: HistoryIcon, labelKey: 'dashboard.loginLogs', color: '#00acc1', dataKey: 'loginLogs' },
  { key: 'attendanceRecords', icon: ScheduleIcon, labelKey: 'dashboard.attendanceRecords', color: '#4caf50', dataKey: 'attendanceRecords' },
  { key: 'workHourRecords', icon: TimerIcon, labelKey: 'dashboard.workHourRecords', color: '#f44336', dataKey: 'workHourRecords' },
  { key: 'leaveRecords', icon: HolidayVillageIcon, labelKey: 'dashboard.leaveRecords', color: '#e91e63', dataKey: 'leaveRecords' },
  { key: 'annualLeaveRecords', icon: BeachAccessIcon, labelKey: 'dashboard.annualLeaveRecords', color: '#3f51b5', dataKey: 'annualLeaveRecords' },
]

export default function DashboardPage() {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({})

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStats()
        setStats(res)
      } catch {
        // silent
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        {t('dashboard.title')}
      </Typography>
      <Grid container spacing={3}>
        {cardConfig.map((card) => {
          const Icon = card.icon
          return (
            <Grid item xs={12} sm={6} md={4} key={card.key}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {t(card.labelKey)}
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
                        {stats[card.dataKey] ?? 0}
                      </Typography>
                    </Box>
                    <Icon sx={{ fontSize: 40, color: card.color }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}
