import { Box, Typography, Card, CardContent, Grid, Button } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import {
  Description as DescriptionIcon,
  Timer as TimerIcon,
  HolidayVillage as HolidayIcon,
  BeachAccess as BeachIcon
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

const menuItems = [
  {
    title: 'attendanceReport.openReport',
    subtitle: 'attendanceReport.openReportDesc',
    icon: <DescriptionIcon sx={{ fontSize: 40 }} />,
    path: '/attendance-report',
    color: '#1976d2'
  },
  {
    title: 'attendanceReport.workHourReport',
    subtitle: 'attendanceReport.workHourReportDesc',
    icon: <TimerIcon sx={{ fontSize: 40 }} />,
    path: '/workhour-report',
    color: '#388e3c'
  },
  {
    title: 'attendanceReport.leaveReport',
    subtitle: 'attendanceReport.leaveReportDesc',
    icon: <HolidayIcon sx={{ fontSize: 40 }} />,
    path: '/leave-report',
    color: '#f57c00'
  },
  {
    title: 'attendanceReport.annualLeaveReport',
    subtitle: 'attendanceReport.annualLeaveReportDesc',
    icon: <BeachIcon sx={{ fontSize: 40 }} />,
    path: '/annual-leave-report',
    color: '#c2185b'
  }
]

export default function AttendanceReportPage() {
  const { t } = useTranslation()

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('attendanceReport.title')}
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {menuItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                  transition: 'all 0.3s ease'
                }
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    py: 2
                  }}
                >
                  <Box sx={{ color: item.color, mb: 2 }}>
                    {item.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {t(item.title)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {t(item.subtitle)}
                  </Typography>
                  <Button
                    variant="contained"
                    component={RouterLink}
                    to={item.path}
                    sx={{ bgcolor: item.color, '&:hover': { bgcolor: item.color } }}
                  >
                    {t('common.view')}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
