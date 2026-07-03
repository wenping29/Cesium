import { useState, useEffect } from 'react'
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Chip, Grid, Pagination, FormControl, InputLabel, Select, MenuItem, TextField, Button } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useTranslation } from 'react-i18next'
import useAttendanceStore from '../store/attendanceStore'

const statusConfig = {
  normal: { label: '正常', color: 'success' },
  late: { label: '迟到', color: 'warning' },
  early: { label: '早退', color: 'warning' },
  absent: { label: '旷工', color: 'error' },
  weekend: { label: '周末', color: 'info' }
}

const PAGE_SIZES = [10, 20, 50, 100]

export default function AttendanceReportPage() {
  const { t } = useTranslation()
  const { attendances, total, loading, fetchAttendances } = useAttendanceStore()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [stats, setStats] = useState({ normal: 0, late: 0, early: 0, absent: 0, weekend: 0 })
  
  const [searchName, setSearchName] = useState('')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [searchStatus, setSearchStatus] = useState('')

  useEffect(() => {
    const params = { page, pageSize }
    if (searchName) params.userName = searchName
    if (startDate) params.startDate = startDate.toISOString().split('T')[0]
    if (endDate) params.endDate = endDate.toISOString().split('T')[0]
    if (searchStatus) params.status = searchStatus
    fetchAttendances(params)
  }, [fetchAttendances, page, pageSize, searchName, startDate, endDate, searchStatus])

  useEffect(() => {
    const counts = { normal: 0, late: 0, early: 0, absent: 0, weekend: 0 }
    attendances.forEach(att => {
      if (counts[att.status] !== undefined) {
        counts[att.status]++
      }
    })
    setStats(counts)
  }, [attendances])

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
  }

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value)
    setPage(1)
  }

  const handleSearch = () => {
    setPage(1)
  }

  const handleReset = () => {
    setSearchName('')
    setStartDate(null)
    setEndDate(null)
    setSearchStatus('')
    setPage(1)
  }

  const formatTime = (time) => {
    if (!time) return '-'
    return time
  }

  const formatDate = (date) => {
    if (!date) return '-'
    const d = new Date(date)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  const getDayOfWeek = (date) => {
    if (!date) return '-'
    const d = new Date(date)
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return days[d.getDay()]
  }

  const totalPages = Math.ceil(total / pageSize)
  const startIndex = (page - 1) * pageSize + 1
  const endIndex = Math.min(page * pageSize, total)

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('attendanceReport.title')}
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="flex-end">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label={t('attendanceReport.userName')}
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              fullWidth
              placeholder={t('attendanceReport.enterUserName')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label={t('attendanceReport.startDate')}
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label={t('attendanceReport.endDate')}
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>{t('attendanceReport.status')}</InputLabel>
              <Select
                label={t('attendanceReport.status')}
                value={searchStatus}
                onChange={(e) => setSearchStatus(e.target.value)}
              >
                <MenuItem value="">{t('common.all')}</MenuItem>
                <MenuItem value="normal">{statusConfig.normal.label}</MenuItem>
                <MenuItem value="late">{statusConfig.late.label}</MenuItem>
                <MenuItem value="early">{statusConfig.early.label}</MenuItem>
                <MenuItem value="absent">{statusConfig.absent.label}</MenuItem>
                <MenuItem value="weekend">{statusConfig.weekend.label}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                onClick={handleSearch}
                color="primary"
                fullWidth
              >
                {t('common.search')}
              </Button>
              <Button
                variant="outlined"
                onClick={handleReset}
                fullWidth
              >
                {t('common.reset')}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

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
            <Typography variant="h5" sx={{ color: '#607d8b' }}>{total}</Typography>
            <Typography variant="body2" color="text.secondary">总计</Typography>
          </Paper>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>日期</TableCell>
              <TableCell>周几</TableCell>
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
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : attendances.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  {t('common.noData')}
                </TableCell>
              </TableRow>
            ) : (
              attendances.map((attendance) => (
                <TableRow key={attendance.id}>
                  <TableCell>{formatDate(attendance.date)}</TableCell>
                  <TableCell>{getDayOfWeek(attendance.date)}</TableCell>
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

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body1">
          {t('common.showing')} {startIndex}-{endIndex} {t('common.of')} {total} {t('common.records')}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>{t('common.pageSize')}</InputLabel>
            <Select
              label={t('common.pageSize')}
              value={pageSize}
              onChange={handlePageSizeChange}
            >
              {PAGE_SIZES.map(size => (
                <MenuItem key={size} value={size}>{size}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Pagination
            count={totalPages}
            page={page}
            pageSize={pageSize}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      </Box>
    </Box>
  )
}
