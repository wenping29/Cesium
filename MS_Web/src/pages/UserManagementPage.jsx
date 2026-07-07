import { useEffect, useState } from 'react'
import {
  Box, Typography, Table, TableHead, TableBody, TableRow, TableCell,
  Button, CircularProgress, Alert, Paper, TableContainer, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel,
  IconButton, Tooltip
} from '@mui/material'
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import useUserStore from '../store/userStore'
import useRoleStore from '../store/roleStore'
import useDepartmentStore from '../store/departmentStore'

export default function UserManagementPage() {
  const { t } = useTranslation()
  const { users, loading, error, fetchUsers, createUser, updateUser, deleteUser } = useUserStore()
  const { roles, fetchRoles } = useRoleStore()
  const { departments, fetchDepartments } = useDepartmentStore()

  const [openDialog, setOpenDialog] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    departmentId: '',
    isActive: true,
    roles: []
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [filterDepartmentId, setFilterDepartmentId] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('')
  const [appliedFilterDepartmentId, setAppliedFilterDepartmentId] = useState('')
  const [appliedFilterStatus, setAppliedFilterStatus] = useState('')

  useEffect(() => {
    fetchUsers()
    fetchRoles()
    fetchDepartments()
  }, [fetchUsers, fetchRoles, fetchDepartments])

  const handleOpenCreate = () => {
    setEditingUser(null)
    setFormData({
      username: '',
      email: '',
      password: '',
      phone: '',
      departmentId: '',
      isActive: true,
      roles: []
    })
    setOpenDialog(true)
  }

  const handleOpenEdit = (user) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      phone: user.phone || '',
      departmentId: user.departmentId || '',
      isActive: user.isActive,
      roles: user.roles || []
    })
    setOpenDialog(true)
  }

  const handleClose = () => {
    setOpenDialog(false)
    setEditingUser(null)
  }

  const handleSubmit = async () => {
    if (editingUser) {
      await updateUser(editingUser.id, formData)
    } else {
      await createUser(formData)
    }
    handleClose()
  }

  const handleDelete = async (id) => {
    if (window.confirm(t('confirmDelete'))) {
      await deleteUser(id)
    }
  }

  const flattenDepartments = (depts, result = []) => {
    depts?.forEach(d => {
      result.push(d)
      flattenDepartments(d.children, result)
    })
    return result
  }

  const allDepartments = flattenDepartments(departments)

  const handleSearch = () => {
    setAppliedSearchQuery(searchQuery)
    setAppliedFilterDepartmentId(filterDepartmentId)
    setAppliedFilterStatus(filterStatus)
  }

  const handleReset = () => {
    setSearchQuery('')
    setFilterDepartmentId('')
    setFilterStatus('')
    setAppliedSearchQuery('')
    setAppliedFilterDepartmentId('')
    setAppliedFilterStatus('')
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = !appliedSearchQuery ||
      user.username?.toLowerCase().includes(appliedSearchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(appliedSearchQuery.toLowerCase())
    const matchesDepartment = !appliedFilterDepartmentId || user.departmentId === appliedFilterDepartmentId
    const matchesStatus = appliedFilterStatus === '' ||
      (appliedFilterStatus === 'active' && user.isActive) ||
      (appliedFilterStatus === 'inactive' && !user.isActive)
    return matchesSearch && matchesDepartment && matchesStatus
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
            placeholder={t('userManagement.username')}
            sx={{ minWidth: 200 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>{t('userManagement.department')}</InputLabel>
            <Select
              value={filterDepartmentId}
              onChange={(e) => setFilterDepartmentId(e.target.value)}
              label={t('userManagement.department')}
            >
              <MenuItem value="">{t('common.all')}</MenuItem>
              {allDepartments.map(d => (
                <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>{t('userManagement.status')}</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              label={t('userManagement.status')}
            >
              <MenuItem value="">{t('common.all')}</MenuItem>
              <MenuItem value="active">{t('common.active')}</MenuItem>
              <MenuItem value="inactive">{t('common.inactive')}</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleSearch}>
            {t('common.search')}
          </Button>
          <Button onClick={handleReset}>
            {t('common.reset')}
          </Button>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
          {t('userManagement.addUser')}
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ height: 650 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>{t('userManagement.username')}</TableCell>
                <TableCell>{t('userManagement.email')}</TableCell>
                <TableCell>{t('userManagement.phone')}</TableCell>
                <TableCell>{t('userManagement.department')}</TableCell>
                <TableCell>{t('userManagement.roles')}</TableCell>
                <TableCell>{t('userManagement.status')}</TableCell>
                <TableCell>{t('userManagement.createdAt')}</TableCell>
                <TableCell>{t('userManagement.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone || '-'}</TableCell>
                  <TableCell>{user.departmentName || '-'}</TableCell>
                  <TableCell>
                    {user.roles?.map((role) => (
                      <Chip key={role} label={role} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                    ))}
                  </TableCell>
                  <TableCell>
                    <Chip label={user.isActive ? t('common.active') : t('common.inactive')}
                      color={user.isActive ? 'success' : 'default'} size="small" />
                  </TableCell>
                  <TableCell>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</TableCell>
                  <TableCell>
                    <Tooltip title={t('common.edit')}>
                      <IconButton size="small" onClick={() => handleOpenEdit(user)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('common.delete')}>
                      <IconButton size="small" color="error" onClick={() => handleDelete(user.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser ? t('userManagement.editUser') : t('userManagement.addUser')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label={t('userManagement.username')}
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              fullWidth
            />
            <TextField
              label={t('userManagement.email')}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              fullWidth
            />
            {!editingUser && (
              <TextField
                label={t('userManagement.password')}
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                fullWidth
              />
            )}
            <TextField
              label={t('userManagement.phone')}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>{t('userManagement.department')}</InputLabel>
              <Select
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                label={t('userManagement.department')}
              >
                <MenuItem value="">{t('common.none')}</MenuItem>
                {allDepartments.map(d => (
                  <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>{t('userManagement.roles')}</InputLabel>
              <Select
                multiple
                value={formData.roles}
                onChange={(e) => setFormData({ ...formData, roles: e.target.value })}
                label={t('userManagement.roles')}
                renderValue={(selected) => selected.join(', ')}
              >
                {roles.map(role => (
                  <MenuItem key={role.id} value={role.name}>{role.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            {editingUser && (
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                }
                label={t('userManagement.isActive')}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('common.cancel')}</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
