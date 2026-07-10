import { useEffect, useState } from 'react'
import {
  Box, Typography, Table, TableHead, TableBody, TableRow, TableCell,
  Button, CircularProgress, Alert, Paper, TableContainer,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  FormControl, InputLabel, Select, MenuItem, IconButton, Tooltip,
  Chip
} from '@mui/material'
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import useRoleStore from '../../store/roleStore'
import useMenuStore from '../../store/menuStore'

const flattenMenus = (menus, result = []) => {
  if (Array.isArray(menus)) {
    menus.forEach(m => {
      result.push(m)
      flattenMenus(m.children, result)
    })
  }
  return result
}

export default function RoleManagementPage() {
  const { t } = useTranslation()
  const { roles, loading, error, fetchRoles, createRole, updateRole, deleteRole } = useRoleStore()
  const { allMenus, fetchAllMenus } = useMenuStore()

  const [openDialog, setOpenDialog] = useState(false)
  const [editingRole, setEditingRole] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    menuIds: []
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('')

  useEffect(() => {
    fetchRoles()
    fetchAllMenus()
  }, [fetchRoles, fetchAllMenus])

  const allMenuItems = flattenMenus(allMenus)

  const handleOpenCreate = () => {
    setEditingRole(null)
    setFormData({ name: '', description: '', menuIds: [] })
    setOpenDialog(true)
  }

  const handleOpenEdit = (role) => {
    setEditingRole(role)
    setFormData({
      name: role.name,
      description: role.description || '',
      menuIds: role.menuIds || []
    })
    setOpenDialog(true)
  }

  const handleClose = () => {
    setOpenDialog(false)
    setEditingRole(null)
  }

  const handleSubmit = async () => {
    if (editingRole) {
      await updateRole(editingRole.id, formData)
    } else {
      await createRole(formData)
    }
    handleClose()
  }

  const handleDelete = async (id) => {
    if (window.confirm(t('confirmDelete'))) {
      await deleteRole(id)
    }
  }

  const getMenuNames = (menuIds) => {
    return menuIds?.map(id => allMenuItems.find(m => m.id === id)?.name).filter(Boolean) || []
  }

  const handleSearch = () => {
    setAppliedSearchQuery(searchQuery)
  }

  const handleReset = () => {
    setSearchQuery('')
    setAppliedSearchQuery('')
  }

  const filteredRoles = roles.filter(role => {
    const matchesSearch = !appliedSearchQuery ||
      role.name?.toLowerCase().includes(appliedSearchQuery.toLowerCase()) ||
      role.description?.toLowerCase().includes(appliedSearchQuery.toLowerCase())
    return matchesSearch
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
            placeholder={t('roleManagement.name')}
            sx={{ minWidth: 200 }}
          />
          <Button variant="contained" onClick={handleSearch}>
            {t('common.search')}
          </Button>
          <Button onClick={handleReset}>
            {t('common.reset')}
          </Button>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
          {t('roleManagement.addRole')}
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
                <TableCell sx={{ height: 48, py: 0 }}>ID</TableCell>
                <TableCell sx={{ height: 48, py: 0 }}>{t('roleManagement.name')}</TableCell>
                <TableCell sx={{ height: 48, py: 0 }}>{t('roleManagement.description')}</TableCell>
                <TableCell sx={{ height: 48, py: 0 }}>{t('roleManagement.menus')}</TableCell>
                <TableCell sx={{ height: 48, py: 0 }}>{t('roleManagement.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRoles.map((role) => (
                <TableRow key={role.id} sx={{ height: 48 }}>
                  <TableCell sx={{ height: 48, py: 0 }}>{role.id}</TableCell>
                  <TableCell sx={{ height: 48, py: 0 }}>{role.name}</TableCell>
                  <TableCell sx={{ height: 48, py: 0 }}>{role.description || '-'}</TableCell>
                  <TableCell sx={{ height: 48, py: 0 }}>
                    {getMenuNames(role.menuIds).map(name => (
                      <Chip key={name} label={name} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                    ))}
                  </TableCell>
                  <TableCell sx={{ height: 48, py: 0 }}>
                    <Tooltip title={t('common.edit')}>
                      <IconButton size="small" onClick={() => handleOpenEdit(role)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('common.delete')}>
                      <IconButton size="small" color="error" onClick={() => handleDelete(role.id)}>
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
          {editingRole ? t('roleManagement.editRole') : t('roleManagement.addRole')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label={t('roleManagement.name')}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={!!editingRole}
              fullWidth
            />
            <TextField
              label={t('roleManagement.description')}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={3}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>{t('roleManagement.menus')}</InputLabel>
              <Select
                multiple
                value={formData.menuIds}
                onChange={(e) => setFormData({ ...formData, menuIds: e.target.value })}
                label={t('roleManagement.menus')}
                renderValue={(selected) => selected.map(id => allMenuItems.find(m => m.id === id)?.name).join(', ')}
              >
                {allMenuItems.map(menu => (
                  <MenuItem key={menu.id} value={menu.id}>
                    {menu.parentId ? '└ ' : ''}{menu.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
