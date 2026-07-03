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
  LinearProgress,
  CircularProgress,
  Alert,
  Pagination
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import useAnnualLeaveStore from '../store/annualleaveStore'
import useUserStore from '../store/userStore'

const PAGE_SIZES = [10, 20, 50, 100]

export default function AnnualLeaveReportPage() {
  const { t } = useTranslation()
  const { annualleaves, total, loading, error, fetchAnnualLeaves } = useAnnualLeaveStore()
  const { users, fetchUsers } = useUserStore()
  const [selectedUser, setSelectedUser] = useState('')
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  useEffect(() => {
    fetchUsers()
    const params = { page, pageSize, year: selectedYear }
    if (selectedUser) params.userId = selectedUser
    fetchAnnualLeaves(params)
  }, [fetchUsers, fetchAnnualLeaves, selectedUser, selectedYear, page, pageSize])

  const getUsagePercent = (item) => {
    if (item.totalDays + item.carriedOverDays === 0) return 0
    return (item.usedDays / (item.totalDays + item.carriedOverDays)) * 100
  }

  const getProgressColor = (percent) => {
    if (percent >= 90) return 'error'
    if (percent >= 70) return 'warning'
    return 'success'
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
  }

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value)
    setPage(1)
  }

  const totalStats = annualleaves.reduce((acc, al) => {
    acc.total += al.totalDays + al.carriedOverDays
    acc.used += al.usedDays
    acc.remaining += al.remainingDays
    return acc
  }, { total: 0, used: 0, remaining: 0 })

  const totalPages = Math.ceil(total / pageSize)
  const startIndex = (page - 1) * pageSize + 1
  const endIndex = Math.min(page * pageSize, total)

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>{t('annualLeaveReport.selectUser')}</InputLabel>
            <Select
              value={selectedUser}
              label={t('annualLeaveReport.selectUser')}
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
            <InputLabel>{t('annualLeaveReport.selectYear')}</InputLabel>
            <Select
              value={selectedYear}
              label={t('annualLeaveReport.selectYear')}
              onChange={(e) => {
                setSelectedYear(e.target.value)
                setPage(1)
              }}
            >
              {[2024, 2025, 2026].map((year) => (
                <MenuItem key={year} value={year}>
                  {year} {t('common.year')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {t('annualLeaveReport.totalDays')}
          </Typography>
          <Typography variant="h4" color="primary">
            {totalStats.total.toFixed(1)} {t('common.day')}
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {t('annualLeaveReport.usedDays')}
          </Typography>
          <Typography variant="h4" color="warning.main">
            {totalStats.used.toFixed(1)} {t('common.day')}
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {t('annualLeaveReport.remainingDays')}
          </Typography>
          <Typography variant="h4" color="success.main">
            {totalStats.remaining.toFixed(1)} {t('common.day')}
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
                <TableCell>{t('annualLeaveReport.user')}</TableCell>
                <TableCell>{t('annualLeaveReport.year')}</TableCell>
                <TableCell>{t('annualLeaveReport.totalDays')}</TableCell>
                <TableCell>{t('annualLeaveReport.carriedOverDays')}</TableCell>
                <TableCell>{t('annualLeaveReport.usedDays')}</TableCell>
                <TableCell>{t('annualLeaveReport.remainingDays')}</TableCell>
                <TableCell>{t('annualLeaveReport.usage')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {annualleaves.map((al) => {
                const percent = getUsagePercent(al)
                return (
                  <TableRow key={al.id}>
                    <TableCell>{al.userName}</TableCell>
                    <TableCell>{al.year}</TableCell>
                    <TableCell>{al.totalDays.toFixed(1)}天</TableCell>
                    <TableCell>{al.carriedOverDays.toFixed(1)}天</TableCell>
                    <TableCell>{al.usedDays.toFixed(1)}天</TableCell>
                    <TableCell>{al.remainingDays.toFixed(1)}天</TableCell>
                    <TableCell sx={{ minWidth: 200 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ flex: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={percent}
                            color={getProgressColor(percent)}
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {percent.toFixed(0)}%
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )
              })}
              {annualleaves.length === 0 && (
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