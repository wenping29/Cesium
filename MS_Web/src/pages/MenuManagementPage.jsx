import { useEffect, useState } from 'react'
import {
  Box, Typography, Table, TableHead, TableBody, TableRow, TableCell,
  Button, CircularProgress, Alert, Paper, TableContainer,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  FormControl, InputLabel, Select, MenuItem, IconButton, Tooltip,
  Switch, FormControlLabel
} from '@mui/material'
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import useMenuStore from '../store/menuStore'

const flattenMenus = (menus, result = []) => {
  menus?.forEach(m => {
    result.push(m)
    flattenMenus(m.children, result)
  })
  return result
}

export default function MenuManagementPage() {
  const { t } = useTranslation()
  const { allMenus, loading, error, fetchAllMenus, createMenu, updateMenu, deleteMenu } = useMenuStore()

  const [openDialog, setOpenDialog] = useState(false)
  const [editingMenu, setEditingMenu] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    path: '',
    icon: '',
    parentId: '',
    sortOrder: 0,
    isVisible: true,
    permission: ''
  })

  useEffect(() => {
    fetchAllMenus()
  }, [fetchAllMenus])

  const allMenuItems = flattenMenus(allMenus)

  const handleOpenCreate = () => {
    setEditingMenu(null)
    setFormData({
      name: '',
      path: '',
      icon: '',
      parentId: '',
      sortOrder: 0,
      isVisible: true,
      permission: ''
    })
    setOpenDialog(true)
  }

  const handleOpenEdit = (menu) => {
    setEditingMenu(menu)
    setFormData({
      name: menu.name,
      path: menu.path || '',
      icon: menu.icon || '',
      parentId: menu.parentId || '',
      sortOrder: menu.sortOrder || 0,
      isVisible: menu.isVisible,
      permission: menu.permission || ''
    })
    setOpenDialog(true)
  }

  const handleClose = () => {
    setOpenDialog(false)
    setEditingMenu(null)
  }

  const handleSubmit = async () => {
    if (editingMenu) {
      await updateMenu(editingMenu.id, formData)
    } else {
      await createMenu(formData)
    }
    handleClose()
  }

  const handleDelete = async (id) => {
    if (window.confirm(t('confirmDelete'))) {
      await deleteMenu(id)
    }
  }

  const getIndent = (menu) => {
    let indent = 0
    let current = allMenuItems.find(m => m.id === menu.parentId)
    while (current) {
      indent++
      current = allMenuItems.find(m => m.id === current.parentId)
    }
    return indent
  }

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
          {t('menuManagement.addMenu')}
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
                <TableCell>{t('menuManagement.name')}</TableCell>
                <TableCell>{t('menuManagement.path')}</TableCell>
                <TableCell>{t('menuManagement.icon')}</TableCell>
                <TableCell>{t('menuManagement.sortOrder')}</TableCell>
                <TableCell>{t('menuManagement.isVisible')}</TableCell>
                <TableCell>{t('menuManagement.permission')}</TableCell>
                <TableCell>{t('menuManagement.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allMenuItems.map((menu) => {
                const indent = getIndent(menu)
                return (
                  <TableRow key={menu.id}>
                    <TableCell>{menu.id}</TableCell>
                    <TableCell sx={{ pl: indent * 3 + 2 }}>
                      {indent > 0 && '└ '}{menu.name}
                    </TableCell>
                    <TableCell>{menu.path || '-'}</TableCell>
                    <TableCell>{menu.icon || '-'}</TableCell>
                    <TableCell>{menu.sortOrder}</TableCell>
                    <TableCell>
                      <Switch checked={menu.isVisible} disabled size="small" />
                    </TableCell>
                    <TableCell>{menu.permission || '-'}</TableCell>
                    <TableCell>
                      <Tooltip title={t('common.edit')}>
                        <IconButton size="small" onClick={() => handleOpenEdit(menu)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('common.delete')}>
                        <IconButton size="small" color="error" onClick={() => handleDelete(menu.id)}>
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
          {editingMenu ? t('menuManagement.editMenu') : t('menuManagement.addMenu')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label={t('menuManagement.name')}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
            />
            <TextField
              label={t('menuManagement.path')}
              value={formData.path}
              onChange={(e) => setFormData({ ...formData, path: e.target.value })}
              fullWidth
            />
            <TextField
              label={t('menuManagement.icon')}
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>{t('menuManagement.parentMenu')}</InputLabel>
              <Select
                value={formData.parentId}
                onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                label={t('menuManagement.parentMenu')}
              >
                <MenuItem value="">{t('common.none')}</MenuItem>
                {allMenuItems.filter(m => !editingMenu || m.id !== editingMenu.id).map(menu => (
                  <MenuItem key={menu.id} value={menu.id}>
                    {menu.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label={t('menuManagement.sortOrder')}
              type="number"
              value={formData.sortOrder}
              onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
              fullWidth
            />
            <TextField
              label={t('menuManagement.permission')}
              value={formData.permission}
              onChange={(e) => setFormData({ ...formData, permission: e.target.value })}
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isVisible}
                  onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                />
              }
              label={t('menuManagement.isVisible')}
            />
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
