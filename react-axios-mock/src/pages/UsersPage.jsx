import { useEffect, useState } from 'react'
import {
  Box, Typography, Table, TableHead, TableBody, TableRow, TableCell,
  TextField, Button, CircularProgress, Alert, Paper, TableContainer,
} from '@mui/material'
import useUserStore from '../store/userStore'

export default function UsersPage() {
  const { users, loading, error, fetchUsers, createUser } = useUserStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !email) return
    await createUser({ name, email })
    setName('')
    setEmail('')
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>User Management</Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField label="Name" size="small" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField label="Email" size="small" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button type="submit" variant="contained">Create</Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Fruit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.age}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.fruit}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}
