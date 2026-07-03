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
  TextField
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

export default function LeaveReportPage() {
  const { t } = useTranslation()
  const { leaves, loading, error, fetchLeaves, approveLeave, rejectLeave } = useLeaveStore()
  const { users, fetchUsers } = useUserStore()
  const [selectedUser, setSelectedUser] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [rejectDialog, setRejectDialog] = useState(null)
  const [rejectRemark, setRejectRemark] = useState('')

  useEffect(() => {
    fetchUsers()
    fetchLeaves()
  }, [fetchUsers, fetchLeaves])

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString()
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

  const stats = leaves.reduce((acc, l) => {
    acc[l.status] = (acc[l.status] || 0) + 1
    acc.total++
    return acc
  }, { total: 0 })

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">{t('leaveReport.title')}</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>{t('leaveReport.selectUser')}</InputLabel>
            <Select
              value={selectedUser}
              label={t('leaveReport.selectUser')}
              onChange={(e) => setSelectedUser(e.target.value)}
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
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <MenuItem value="">{t('common.all')}</MenuItem>
              <MenuItem value="pending">{t('leaveReport.pending')}</MenuItem>
              <MenuItem value="approved">{t('leaveReport.approved')}</MenuItem>
              <MenuItem value="rejected">{t('leaveReport.rejected')}</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

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

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('leaveReport.user')}</TableCell>
                <TableCell>{t('leaveReport.type')}</TableCell>
                <TableCell>{t('leaveReport.startDate')}</TableCell>
                <TableCell>{t('leaveReport.endDate')}</TableCell>
                <TableCell>{t('leaveReport.days')}</TableCell>
                <TableCell>{t('leaveReport.reason')}</TableCell>
                <TableCell>{t('leaveReport.status')}</TableCell>
                <TableCell>{t('leaveReport.approver')}</TableCell>
                <TableCell>{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaves.map((l) => (
                <TableRow key={l.id}>
                  <TableCell>{l.userName}</TableCell>
                  <TableCell>{leaveTypes[l.leaveType] || l.leaveType}</TableCell>
                  <TableCell>{formatDate(l.startDate)}</TableCell>
                  <TableCell>{formatDate(l.endDate)}</TableCell>
                  <TableCell>{l.days}天 {l.hours}小时</TableCell>
                  <TableCell>{l.reason || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={l.status === 'pending' ? t('leaveReport.pending') :
                             l.status === 'approved' ? t('leaveReport.approved') :
                             t('leaveReport.rejected')}
                      color={statusColors[l.status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{l.approverName || '-'}</TableCell>
                  <TableCell>
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
