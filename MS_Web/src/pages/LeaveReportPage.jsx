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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Pagination
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import useLeaveStore from '../store/leaveStore'
import useUserStore from '../store/userStore'

const leaveTypes = {
  personal: '事假',
  sick: '病假',
  maternity: '产假',
  marriage: '婚假',
  bereavement: '丧假'
}

const statusColors = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error'
}

const PAGE_SIZES = [10, 20, 50, 100]

export default function LeaveReportPage() {
  const { t } = useTranslation()
  const { leaves, total, loading, error, fetchLeaves, approveLeave, rejectLeave } = useLeaveStore()
  const { users, fetchUsers } = useUserStore()
  const [selectedUser, setSelectedUser] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [rejectDialog, setRejectDialog] = useState(null)
  const [rejectRemark, setRejectRemark] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  useEffect(() => {
    fetchUsers()
    const params = { page, pageSize }
    if (selectedUser) params.userId = selectedUser
    if (selectedStatus) params.status = selectedStatus
    fetchLeaves(params)
  }, [fetchUsers, fetchLeaves, selectedUser, selectedStatus, page, pageSize])

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  const handleApprove = async (id) => {
    await approveLeave(id)
    await fetchLeaves()
  }

  const handleReject = async () => {
    if (rejectDialog) {
      await rejectLeave(rejectDialog, rejectRemark)
      await fetchLeaves()
      setRejectDialog(null)
      setRejectRemark('')
    }
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
  }

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value)
    setPage(1)
  }

  const stats = leaves.reduce((acc, l) => {
    acc[l.status] = (acc[l.status] || 0) + 1
    acc.total++
    return acc
  }, { total: 0 })

  const safeTotal = total || 0
  const totalPages = Math.ceil(safeTotal / pageSize) || 1
  const startIndex = Math.max(1, (page - 1) * pageSize + 1)
  const endIndex = Math.min(page * pageSize, safeTotal)

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>{t('leaveReport.selectUser')}</InputLabel>
            <Select
              value={selectedUser}
              label={t('leaveReport.selectUser')}
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
            <InputLabel>{t('leaveReport.selectStatus')}</InputLabel>
            <Select
              value={selectedStatus}
              label={t('leaveReport.selectStatus')}
              onChange={(e) => {
                setSelectedStatus(e.target.value)
                setPage(1)
              }}
            >
              <MenuItem value="">{t('common.all')}</MenuItem>
              <MenuItem value="pending">{t('leaveReport.pending')}</MenuItem>
              <MenuItem value="approved">{t('leaveReport.approved')}</MenuItem>
              <MenuItem value="rejected">{t('leaveReport.rejected')}</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 3 }}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {t('leaveReport.total')}
          </Typography>
          <Typography variant="h4">{stats.total || 0}</Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {t('leaveReport.pending')}
          </Typography>
          <Typography variant="h4" color="warning.main">{stats.pending || 0}</Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {t('leaveReport.approved')}
          </Typography>
          <Typography variant="h4" color="success.main">{stats.approved || 0}</Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {t('leaveReport.rejected')}
          </Typography>
          <Typography variant="h4" color="error.main">{stats.rejected || 0}</Typography>
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
                <TableCell sx={{ height: 48, py: 0 }}>{t('leaveReport.user')}</TableCell>
                <TableCell sx={{ height: 48, py: 0 }}>{t('leaveReport.type')}</TableCell>
                <TableCell sx={{ height: 48, py: 0 }}>{t('leaveReport.startDate')}</TableCell>
                <TableCell sx={{ height: 48, py: 0 }}>{t('leaveReport.endDate')}</TableCell>
                <TableCell sx={{ height: 48, py: 0 }}>{t('leaveReport.days')}</TableCell>
                <TableCell sx={{ height: 48, py: 0 }}>{t('leaveReport.reason')}</TableCell>
                <TableCell sx={{ height: 48, py: 0 }}>{t('leaveReport.status')}</TableCell>
                <TableCell sx={{ height: 48, py: 0 }}>{t('leaveReport.approver')}</TableCell>
                <TableCell sx={{ height: 48, py: 0 }}>{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaves.map((l) => (
                <TableRow key={l.id} sx={{ height: 48 }}>
                  <TableCell sx={{ height: 48, py: 0 }}>{l.userName}</TableCell>
                  <TableCell sx={{ height: 48, py: 0 }}>{leaveTypes[l.leaveType] || l.leaveType}</TableCell>
                  <TableCell sx={{ height: 48, py: 0 }}>{formatDate(l.startDate)}</TableCell>
                  <TableCell sx={{ height: 48, py: 0 }}>{formatDate(l.endDate)}</TableCell>
                  <TableCell sx={{ height: 48, py: 0 }}>{l.days}天 {l.hours}小时</TableCell>
                  <TableCell sx={{ height: 48, py: 0 }}>{l.reason || '-'}</TableCell>
                  <TableCell sx={{ height: 48, py: 0 }}>
                    <Chip
                      label={l.status === 'pending' ? t('leaveReport.pending') :
                             l.status === 'approved' ? t('leaveReport.approved') :
                             t('leaveReport.rejected')}
                      color={statusColors[l.status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell sx={{ height: 48, py: 0 }}>{l.approverName || '-'}</TableCell>
                  <TableCell sx={{ height: 48, py: 0 }}>
                    {l.status === 'pending' && (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="contained"
                          size="small"
                          color="success"
                          onClick={() => handleApprove(l.id)}
                        >
                          {t('leaveReport.approve')}
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          color="error"
                          onClick={() => setRejectDialog(l.id)}
                        >
                          {t('leaveReport.reject')}
                        </Button>
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {leaves.length === 0 && (
                <TableRow sx={{ height: 48 }}>
                  <TableCell sx={{ height: 48, py: 0 }} colSpan={9} align="center">
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

      <Dialog open={!!rejectDialog} onClose={() => setRejectDialog(null)}>
        <DialogTitle>{t('leaveReport.rejectReason')}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            multiline
            rows={3}
            label={t('leaveReport.rejectRemark')}
            value={rejectRemark}
            onChange={(e) => setRejectRemark(e.target.value)}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialog(null)}>{t('common.cancel')}</Button>
          <Button onClick={handleReject} color="error">{t('common.confirm')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}