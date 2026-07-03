import { useState, useEffect } from 'react'
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Chip, Grid } from '@mui/material'
import { useTranslation } from 'react-i18next'
import useAttendanceStore from '../store/attendanceStore'

const statusConfig = {
  normal: { label: '正常', color: 'success' },
  late: { label: '迟到', color: 'warning' },
  early: { label: '早退', color: 'warning' },
  absent: { label: '旷工', color: 'error' },
  weekend: { label: '周末', color: 'info' }
}

export default function AttendanceReportPage() {
  const { t } = useTranslation()
  const { attendances, loading, fetchAttendances } = useAttendanceStore()
  const [stats, setStats] = useState({ normal: 0, late: 0, early: 0, absent: 0, weekend: 0 })

  useEffect(() => {
    fetchAttendances()
  }, [fetchAttendances])

  useEffect(() => {
    const counts = { normal: 0, late: 0, early: 0, absent: 0, weekend: 0 }
    attendances.forEach(att => {
      if (counts[att.status] !== undefined) {
        counts[att.status]++
      }
    })
    setStats(counts)
  }, [attendances])

  const formatTime = (time) => {
    if (!time) return '-'
    return time
  }

  const formatDate = (date) => {
    if (!date) return '-'
    const d = new Date(date)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('attendanceReport.title')}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ color: '#4caf50' }}>{stats.normal}</Typography>
            <Typography variant="body2" color="text.secondary">正常</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ color: '#ff9800' }}>{stats.late}</Typography>
            <Typography variant="body2" color="text.secondary">迟到</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ color: '#ff9800' }}>{stats.early}</Typography>
            <Typography variant="body2" color="text.secondary">早退</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ color: '#f44336' }}>{stats.absent}</Typography>
            <Typography variant="body2" color="text.secondary">旷工</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ color: '#2196f3' }}>{stats.weekend}</Typography>
            <Typography variant="body2" color="text.secondary">周末加班</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ color: '#607d8b' }}>{attendances.length}</Typography>
            <Typography variant="body2" color="text.secondary">总计</Typography>
          </Paper>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>日期</TableCell>
              <TableCell>用户</TableCell>
              <TableCell>上班时间</TableCell>
              <TableCell>下班时间</TableCell>
              <TableCell>状态</TableCell>
              <TableCell>备注</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : attendances.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  {t('common.noData')}
                </TableCell>
              </TableRow>
            ) : (
              attendances.map((attendance) => (
                <TableRow key={attendance.id}>
                  <TableCell>{formatDate(attendance.date)}</TableCell>
                  <TableCell>{attendance.userName}</TableCell>
                  <TableCell>{formatTime(attendance.checkInTime)}</TableCell>
                  <TableCell>{formatTime(attendance.checkOutTime)}</TableCell>
                  <TableCell>
                    <Chip
                      label={statusConfig[attendance.status]?.label || attendance.status}
                      color={statusConfig[attendance.status]?.color || 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{attendance.remark || '-'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
