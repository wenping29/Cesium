import { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  Pagination
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import useWorkHourStore from '../store/workhourStore'
import useUserStore from '../store/userStore'

const PAGE_SIZES = [10, 20, 50, 100]

export default function WorkHourReportPage() {
  const { t } = useTranslation()
  const { workhours, total, loading, error, fetchWorkHours } = useWorkHourStore()
  const { users, fetchUsers } = useUserStore()
  const [selectedUser, setSelectedUser] = useState('')
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  useEffect(() => {
    fetchUsers()
    const params = { page, pageSize, month: selectedMonth }
    if (selectedUser) params.userId = selectedUser
    fetchWorkHours(params)
  }, [fetchUsers, fetchWorkHours, selectedUser, selectedMonth, page, pageSize])

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  const formatTime = (hours) => {
    return hours.toFixed(1) + 'h'
  }

  const totalStats = workhours.reduce((acc, wh) => {
    acc.regular += wh.regularHours
    acc.overtime += wh.overtimeHours
    acc.weekend += wh.weekendHours
    acc.holiday += wh.holidayHours
    acc.total += wh.regularHours + wh.overtimeHours + wh.weekendHours + wh.holidayHours
    return acc
  }, { regular: 0, overtime: 0, weekend: 0, holiday: 0, total: 0 })

  const getStatusColor = (hours) => {
    if (hours >= 8) return 'success'
    if (hours >= 6) return 'warning'
    return 'error'
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
  }

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value)
    setPage(1)
  }

  const totalPages = Math.ceil(total / pageSize)
  const startIndex = (page - 1) * pageSize + 1
  const endIndex = Math.min(page * pageSize, total)

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>{t('workHourReport.selectUser')}</InputLabel>
            <Select
              value={selectedUser}
              label={t('workHourReport.selectUser')}
              onChange={(e) => {
                setSelectedUser(e.target.value)
                setPage(1)
              }}
            >
              <MenuItem value="">{t('common.all')}</MenuItem>
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>{t('workHourReport.selectMonth')}</InputLabel>
            <Select
              value={selectedMonth}
              label={t('workHourReport.selectMonth')}
              onChange={(e) => {
                setSelectedMonth(e.target.value)
                setPage(1)
              }}
            >
              {[...Array(12)].map((_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  {i + 1} {t('common.month')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 2, mb: 3 }}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {t('workHourReport.regularHours')}
          </Typography>
          <Typography variant="h4" color="primary">
            {totalStats.regular.toFixed(1)}h
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {t('workHourReport.overtimeHours')}
          </Typography>
          <Typography variant="h4" color="warning.main">
            {totalStats.overtime.toFixed(1)}h
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {t('workHourReport.weekendHours')}
          </Typography>
          <Typography variant="h4" color="info.main">
            {totalStats.weekend.toFixed(1)}h
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {t('workHourReport.holidayHours')}
          </Typography>
          <Typography variant="h4" color="error.main">
            {totalStats.holiday.toFixed(1)}h
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {t('workHourReport.totalHours')}
          </Typography>
          <Typography variant="h4" color="success.main">
            {totalStats.total.toFixed(1)}h
          </Typography>
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
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('workHourReport.date')}</TableCell>
                <TableCell>{t('workHourReport.user')}</TableCell>
                <TableCell>{t('workHourReport.regularHours')}</TableCell>
                <TableCell>{t('workHourReport.overtimeHours')}</TableCell>
                <TableCell>{t('workHourReport.weekendHours')}</TableCell>
                <TableCell>{t('workHourReport.holidayHours')}</TableCell>
                <TableCell>{t('workHourReport.totalHours')}</TableCell>
                <TableCell>{t('workHourReport.project')}</TableCell>
                <TableCell>{t('workHourReport.task')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workhours.map((wh) => (
                <TableRow key={wh.id}>
                  <TableCell>{formatDate(wh.date)}</TableCell>
                  <TableCell>{wh.userName}</TableCell>
                  <TableCell>{formatTime(wh.regularHours)}</TableCell>
                  <TableCell>{formatTime(wh.overtimeHours)}</TableCell>
                  <TableCell>{formatTime(wh.weekendHours)}</TableCell>
                  <TableCell>{formatTime(wh.holidayHours)}</TableCell>
                  <TableCell>
                    <Chip
                      label={formatTime(wh.regularHours + wh.overtimeHours + wh.weekendHours + wh.holidayHours)}
                      color={getStatusColor(wh.regularHours + wh.overtimeHours + wh.weekendHours + wh.holidayHours)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{wh.projectName || '-'}</TableCell>
                  <TableCell>{wh.taskDescription || '-'}</TableCell>
                </TableRow>
              ))}
              {workhours.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center">
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