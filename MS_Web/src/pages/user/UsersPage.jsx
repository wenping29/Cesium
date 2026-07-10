import { useEffect, useState } from 'react'
import {
  Box, Typography, Table, TableHead, TableBody, TableRow, TableCell,
  TextField, Button, CircularProgress, Alert, Paper, TableContainer,
  Chip
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import useUserStore from '../../store/userStore'

export default function UsersPage() {
  const { t } = useTranslation()
  const { users, loading, error, fetchUsers } = useUserStore()

  useEffect(() => { fetchUsers() }, [fetchUsers])

  return (
    <Box sx={{ p: 2 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ height: 48, py: 0 }}>ID</TableCell>
                <TableCell sx={{ height: 48, py: 0 }}>用户名</TableCell>
                <TableCell sx={{ height: 48, py: 0 }}>邮箱</TableCell>
                <TableCell sx={{ height: 48, py: 0 }}>角色</TableCell>
                <TableCell sx={{ height: 48, py: 0 }}>创建时间</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id} sx={{ height: 48 }}>
                  <TableCell sx={{ height: 48, py: 0 }}>{u.id}</TableCell>
                  <TableCell sx={{ height: 48, py: 0 }}>{u.username}</TableCell>
                  <TableCell sx={{ height: 48, py: 0 }}>{u.email}</TableCell>
                  <TableCell sx={{ height: 48, py: 0 }}>
                    {u.roles?.map((role) => (
                      <Chip key={role} label={role} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                    ))}
                  </TableCell>
                  <TableCell sx={{ height: 48, py: 0 }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}
