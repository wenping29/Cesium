import { useState, useEffect } from 'react'
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip, IconButton,
  CircularProgress, TablePagination, Alert, Snackbar, Divider,
  FormControl, InputLabel, Select
} from '@mui/material'
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  Notifications as NotificationsIcon,
  SystemUpdate as SystemUpdateIcon,
  Assignment as AssignmentIcon,
  Chat as ChatIcon,
  Edit as EditIcon
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import {
  getAllNotifications,
  createNotification,
  deleteNotification
} from '../api/notification'

const typeConfig = {
  system: { icon: <SystemUpdateIcon />, color: 'info' },
  task: { icon: <AssignmentIcon />, color: 'warning' },
  message: { icon: <ChatIcon />, color: 'success' }
}

const getRelativeTime = (dateStr) => {
  const date = new Date(dateStr.replace(' ', 'T'))
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return dateStr
}

export default function SendMessagePage() {
  const { t } = useTranslation()
  const [notifications, setNotifications] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [rowsPerPage] = useState(20)
  const [openDialog, setOpenDialog] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'system',
    sendTime: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterReadStatus, setFilterReadStatus] = useState('')
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('')
  const [appliedFilterType, setAppliedFilterType] = useState('')
  const [appliedFilterReadStatus, setAppliedFilterReadStatus] = useState('')

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const params = { page: page + 1, size: rowsPerPage }
      const res = await getAllNotifications(params)
      setNotifications(res.data || [])
      setTotal(res.total || 0)
    } catch {
      console.error('Failed to fetch notifications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [page])

  const handleOpenDialog = () => {
    setFormData({ title: '', content: '', type: 'system', sendTime: '' })
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const handleInputChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim()) return

    if (formData.sendTime) {
      const sendDate = new Date(formData.sendTime)
      if (sendDate <= new Date()) {
        setSnackbar({ open: true, message: '发送失败：计划发送时间已过期', severity: 'error' })
        return
      }
    }

    try {
      setSubmitting(true)
      await createNotification(formData)
      setSnackbar({ open: true, message: '消息发送成功', severity: 'success' })
      handleCloseDialog()
      setPage(0)
      fetchNotifications()
    } catch {
      setSnackbar({ open: true, message: '发送失败', severity: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id)
      setSnackbar({ open: true, message: '通知已删除', severity: 'success' })
      fetchNotifications()
    } catch {
      setSnackbar({ open: true, message: '删除失败', severity: 'error' })
    }
  }

  const handleChangePage = (_, newPage) => {
    setPage(newPage)
  }

  const typeOptions = [
    { value: 'system', label: '系统通知' },
    { value: 'task', label: '任务通知' },
    { value: 'message', label: '普通消息' }
  ]

  const handleSearch = () => {
    setAppliedSearchQuery(searchQuery)
    setAppliedFilterType(filterType)
    setAppliedFilterReadStatus(filterReadStatus)
  }

  const handleReset = () => {
    setSearchQuery('')
    setFilterType('')
    setFilterReadStatus('')
    setAppliedSearchQuery('')
    setAppliedFilterType('')
    setAppliedFilterReadStatus('')
  }

  const filteredNotifications = notifications.filter(item => {
    const matchesSearch = !appliedSearchQuery ||
      item.title?.toLowerCase().includes(appliedSearchQuery.toLowerCase()) ||
      item.content?.toLowerCase().includes(appliedSearchQuery.toLowerCase())
    const matchesType = !appliedFilterType || item.type === appliedFilterType
    const matchesReadStatus = appliedFilterReadStatus === '' ||
      (appliedFilterReadStatus === 'read' && item.read) ||
      (appliedFilterReadStatus === 'unread' && !item.read)
    return matchesSearch && matchesType && matchesReadStatus
  })

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            label={t('common.search')}
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="消息标题"
            sx={{ minWidth: 200 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>消息类型</InputLabel>
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              label="消息类型"
            >
              <MenuItem value="">{t('common.all')}</MenuItem>
              {typeOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>阅读状态</InputLabel>
            <Select
              value={filterReadStatus}
              onChange={(e) => setFilterReadStatus(e.target.value)}
              label="阅读状态"
            >
              <MenuItem value="">{t('common.all')}</MenuItem>
              <MenuItem value="read">已读</MenuItem>
              <MenuItem value="unread">未读</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleSearch}>
            {t('common.search')}
          </Button>
          <Button onClick={handleReset}>
            {t('common.reset')}
          </Button>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          新增消息
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ height: 600 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>类型</TableCell>
              <TableCell>标题</TableCell>
              <TableCell>内容</TableCell>
              <TableCell>发送人</TableCell>
              <TableCell>时间</TableCell>
              <TableCell>状态</TableCell>
              <TableCell align="center">{t('userManagement.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <CircularProgress />
                  </Box>
                </TableCell>
              </TableRow>
            ) : filteredNotifications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <NotificationsIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      暂无通知消息
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              filteredNotifications.map((item) => {
                const typeInfo = typeConfig[item.type] || typeConfig.system
                return (
                  <TableRow key={item.id} hover>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>
                      <Chip
                        icon={typeInfo.icon}
                        label={typeOptions.find(o => o.value === item.type)?.label || item.type}
                        size="small"
                        color={typeInfo.color}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: item.read ? 'normal' : 'bold' }}>
                      {item.title}
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: 300,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {item.content}
                      </Typography>
                    </TableCell>
                    <TableCell>{item.sender}</TableCell>
                    <TableCell>{getRelativeTime(item.date)}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.read ? '已读' : '未读'}
                        size="small"
                        color={item.read ? 'default' : 'primary'}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(item.id)}
                        title={t('common.delete')}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[20]}
        />
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>发送新消息</DialogTitle>
        <Divider />
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>消息类型</InputLabel>
              <Select
                value={formData.type}
                onChange={handleInputChange('type')}
                label="消息类型"
              >
                {typeOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="计划发送时间"
              type="datetime-local"
              value={formData.sendTime}
              onChange={handleInputChange('sendTime')}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="消息标题"
              value={formData.title}
              onChange={handleInputChange('title')}
              fullWidth
              required
            />
            <TextField
              label="消息内容"
              value={formData.content}
              onChange={handleInputChange('content')}
              fullWidth
              required
              multiline
              rows={4}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t('common.cancel')}</Button>
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={handleSubmit}
            disabled={!formData.title.trim() || !formData.content.trim() || submitting}
          >
            发送
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
