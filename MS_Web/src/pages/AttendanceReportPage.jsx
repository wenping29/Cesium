import { useState, useEffect } from 'react'
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Chip, Pagination, FormControl, InputLabel, Select, MenuItem, TextField, Button, Alert } from '@mui/material'
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
  const { attendances, total, loading, error, fetchAttendances } = useAttendanceStore()
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
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label={t('attendanceReport.userName')}
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            size="small"
            sx={{ minWidth: 150 }}
            placeholder={t('attendanceReport.enterUserName')}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ height: 40 }}>
            <DatePicker
              label={t('attendanceReport.startDate')}
              value={startDate}
              sx={{ height: 40 }}
              onChange={(newValue) => setStartDate(newValue)}
              renderInput={(params) => <TextField {...params}  />}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ height: 40 }}>
            <DatePicker
              label={t('attendanceReport.endDate')}
              value={endDate}
              sx={{ height: 40
               }}
              onChange={(newValue) => setEndDate(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <FormControl size="small" sx={{ minWidth: 100,height:48 }}>
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
          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{ backgroundColor: '#1a73e8', color: 'white', height: 48 }}
          >
            查询
          </Button>
          <Button
            variant="contained"
            onClick={handleReset}
            sx={{ backgroundColor: '#1a73e8', color: 'white', height: 48 }}
          >
            重置
          </Button>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 2, mb: 3 }}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">正常</Typography>
          <Typography variant="h4" color="success.main">{stats.normal}</Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">迟到</Typography>
          <Typography variant="h4" color="warning.main">{stats.late}</Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">早退</Typography>
          <Typography variant="h4" color="warning.main">{stats.early}</Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">旷工</Typography>
          <Typography variant="h4" color="error.main">{stats.absent}</Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">周末加班</Typography>
          <Typography variant="h4" color="info.main">{stats.weekend}</Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">总计</Typography>
          <Typography variant="h4" color="primary">{total}</Typography>
        </Paper>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
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

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ height: 750, overflowY: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('attendanceReport.date')}</TableCell>
                <TableCell>{t('attendanceReport.dayOfWeek')}</TableCell>
                <TableCell>{t('attendanceReport.user')}</TableCell>
                <TableCell>{t('attendanceReport.checkInTime')}</TableCell>
                <TableCell>{t('attendanceReport.checkOutTime')}</TableCell>
                <TableCell>{t('attendanceReport.status')}</TableCell>
                <TableCell>{t('attendanceReport.remark')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendances.map((attendance) => (
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
              ))}
              {attendances.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    {t('common.noData')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Paper sx={{ mt: 3, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', gap: 4 }}>
          <Typography variant="body2" color="text.secondary">
            当前页：{page} / {totalPages}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            总记录数：{total} 条
          </Typography>
          <Typography variant="body2" color="text.secondary">
            每页显示：{pageSize} 条
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {loading ? '加载中...' : '数据已加载完成'}
        </Typography>
      </Paper>
    </Box>
  )
}