import { useEffect, useState } from 'react'
import {
  Box, Typography, Table, TableHead, TableBody, TableRow, TableCell,
  Button, CircularProgress, Alert, Paper, TableContainer,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  FormControl, InputLabel, Select, MenuItem, IconButton, Tooltip,
  Switch, FormControlLabel, Chip
} from '@mui/material'
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import useDepartmentStore from '../store/departmentStore'

const flattenDepartments = (depts, result = []) => {
  if (Array.isArray(depts)) {
    depts.forEach(d => {
      result.push(d)
      flattenDepartments(d.children, result)
    })
  }
  return result
}

export default function DepartmentManagementPage() {
  const { t } = useTranslation()
  const { allDepartments, loading, error, fetchAllDepartments, createDepartment, updateDepartment, deleteDepartment } = useDepartmentStore()

  const [openDialog, setOpenDialog] = useState(false)
  const [editingDept, setEditingDept] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    parentId: '',
    sortOrder: 0,
    leader: '',
    phone: '',
    email: '',
    address: '',
    isActive: true
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('')
  const [appliedFilterStatus, setAppliedFilterStatus] = useState('')

  useEffect(() => {
    fetchAllDepartments()
  }, [fetchAllDepartments])

  const allDeptItems = flattenDepartments(allDepartments)

  const handleOpenCreate = () => {
    setEditingDept(null)
    setFormData({
      name: '',
      code: '',
      parentId: '',
      sortOrder: 0,
      leader: '',
      phone: '',
      email: '',
      address: '',
      isActive: true
    })
    setOpenDialog(true)
  }

  const handleOpenEdit = (dept) => {
    setEditingDept(dept)
    setFormData({
      name: dept.name,
      code: dept.code || '',
      parentId: dept.parentId || '',
      sortOrder: dept.sortOrder || 0,
      leader: dept.leader || '',
      phone: dept.phone || '',
      email: dept.email || '',
      address: dept.address || '',
      isActive: dept.isActive
    })
    setOpenDialog(true)
  }

  const handleClose = () => {
    setOpenDialog(false)
    setEditingDept(null)
  }

  const handleSubmit = async () => {
    if (editingDept) {
      await updateDepartment(editingDept.id, formData)
    } else {
      await createDepartment(formData)
    }
    handleClose()
  }

  const handleDelete = async (id) => {
    if (window.confirm(t('confirmDelete'))) {
      await deleteDepartment(id)
    }
  }

  const getIndent = (dept) => {
    let indent = 0
    let current = allDeptItems.find(d => d.id === dept.parentId)
    while (current) {
      indent++
      current = allDeptItems.find(d => d.id === current.parentId)
    }
    return indent
  }

  const handleSearch = () => {
    setAppliedSearchQuery(searchQuery)
    setAppliedFilterStatus(filterStatus)
  }

  const handleReset = () => {
    setSearchQuery('')
    setFilterStatus('')
    setAppliedSearchQuery('')
    setAppliedFilterStatus('')
  }

  const filteredDeptItems = allDeptItems.filter(dept => {
    const matchesSearch = !appliedSearchQuery ||
      dept.name?.toLowerCase().includes(appliedSearchQuery.toLowerCase()) ||
      dept.code?.toLowerCase().includes(appliedSearchQuery.toLowerCase()) ||
      dept.leader?.toLowerCase().includes(appliedSearchQuery.toLowerCase())
    const matchesStatus = appliedFilterStatus === '' ||
      (appliedFilterStatus === 'active' && dept.isActive) ||
      (appliedFilterStatus === 'inactive' && !dept.isActive)
    return matchesSearch && matchesStatus
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
            placeholder={t('departmentManagement.name')}
            sx={{ minWidth: 200 }}
          />
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
          {t('departmentManagement.addDepartment')}
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ height: 600 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ height: 48, py: 0 }}>ID</TableCell>
                <TableCell sx={{ height: 48, py: 0 }}>{t('departmentManagement.name')}</TableCell>
                <TableCell sx={{ height: 48, py: 0 }}>{t('departmentManagement.code')}</TableCell>
                <TableCell sx={{ height: 48, py: 0 }}>{t('departmentManagement.leader')}</TableCell>
                <TableCell sx={{ height: 48, py: 0 }}>{t('departmentManagement.phone')}</TableCell>
                <TableCell sx={{ height: 48, py: 0 }}>{t('departmentManagement.userCount')}</TableCell>
                <TableCell sx={{ height: 48, py: 0 }}>{t('departmentManagement.isActive')}</TableCell>
                <TableCell sx={{ height: 48, py: 0 }}>{t('departmentManagement.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDeptItems.map((dept) => {
                const indent = getIndent(dept)
                return (
                  <TableRow key={dept.id} sx={{ height: 48 }}>
                    <TableCell sx={{ height: 48, py: 0 }}>{dept.id}</TableCell>
                    <TableCell sx={{ height: 48, py: 0, pl: indent * 3 + 2 }}>
                      {indent > 0 && '└ '}{dept.name}
                    </TableCell>
                    <TableCell sx={{ height: 48, py: 0 }}>{dept.code || '-'}</TableCell>
                    <TableCell sx={{ height: 48, py: 0 }}>{dept.leader || '-'}</TableCell>
                    <TableCell sx={{ height: 48, py: 0 }}>{dept.phone || '-'}</TableCell>
                    <TableCell sx={{ height: 48, py: 0 }}>
                      <Chip label={dept.userCount || 0} size="small" />
                    </TableCell>
                    <TableCell sx={{ height: 48, py: 0 }}>
                      <Chip label={dept.isActive ? t('common.active') : t('common.inactive')}
                        color={dept.isActive ? 'success' : 'default'} size="small" />
                    </TableCell>
                    <TableCell sx={{ height: 48, py: 0 }}>
                      <Tooltip title={t('common.edit')}>
                        <IconButton size="small" onClick={() => handleOpenEdit(dept)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('common.delete')}>
                        <IconButton size="small" color="error" onClick={() => handleDelete(dept.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingDept ? t('departmentManagement.editDepartment') : t('departmentManagement.addDepartment')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label={t('departmentManagement.name')}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
            />
            <TextField
              label={t('departmentManagement.code')}
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>{t('departmentManagement.parentDepartment')}</InputLabel>
              <Select
                value={formData.parentId}
                onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                label={t('departmentManagement.parentDepartment')}
              >
                <MenuItem value="">{t('common.none')}</MenuItem>
                {allDeptItems.filter(d => !editingDept || d.id !== editingDept.id).map(dept => (
                  <MenuItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label={t('departmentManagement.sortOrder')}
              type="number"
              value={formData.sortOrder}
              onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
              fullWidth
            />
            <TextField
              label={t('departmentManagement.leader')}
              value={formData.leader}
              onChange={(e) => setFormData({ ...formData, leader: e.target.value })}
              fullWidth
            />
            <TextField
              label={t('departmentManagement.phone')}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              fullWidth
            />
            <TextField
              label={t('departmentManagement.email')}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              fullWidth
            />
            <TextField
              label={t('departmentManagement.address')}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              multiline
              rows={2}
              fullWidth
            />
            {editingDept && (
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                }
                label={t('departmentManagement.isActive')}
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
