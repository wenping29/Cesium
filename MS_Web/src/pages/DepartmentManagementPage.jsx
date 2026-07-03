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
  depts?.forEach(d => {
    result.push(d)
    flattenDepartments(d.children, result)
  })
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

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3 }}>
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
                <TableCell>ID</TableCell>
                <TableCell>{t('departmentManagement.name')}</TableCell>
                <TableCell>{t('departmentManagement.code')}</TableCell>
                <TableCell>{t('departmentManagement.leader')}</TableCell>
                <TableCell>{t('departmentManagement.phone')}</TableCell>
                <TableCell>{t('departmentManagement.userCount')}</TableCell>
                <TableCell>{t('departmentManagement.isActive')}</TableCell>
                <TableCell>{t('departmentManagement.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allDeptItems.map((dept) => {
                const indent = getIndent(dept)
                return (
                  <TableRow key={dept.id}>
                    <TableCell>{dept.id}</TableCell>
                    <TableCell sx={{ pl: indent * 3 + 2 }}>
                      {indent > 0 && '└ '}{dept.name}
                    </TableCell>
                    <TableCell>{dept.code || '-'}</TableCell>
                    <TableCell>{dept.leader || '-'}</TableCell>
                    <TableCell>{dept.phone || '-'}</TableCell>
                    <TableCell>
                      <Chip label={dept.userCount || 0} size="small" />
                    </TableCell>
                    <TableCell>
                      <Chip label={dept.isActive ? t('common.active') : t('common.inactive')}
                        color={dept.isActive ? 'success' : 'default'} size="small" />
                    </TableCell>
                    <TableCell>
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
