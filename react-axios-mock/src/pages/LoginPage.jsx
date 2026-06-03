import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Card, TextField, Typography, Button, Alert,
} from '@mui/material'
import useAuthStore from '../store/authStore'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username || !password) { setError('Please enter username and password'); return }
    setLoading(true)
    setError('')
    try {
      await login({ username, password })
      navigate('/users', { replace: true })
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      <Card sx={{ p: 4, width: 360, boxShadow: 4 }}>
        <Typography variant="h5" textAlign="center" fontWeight={600} mb={3}>
          登录
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            size="small"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            size="small"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ py: 1.2 }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Box>
      </Card>
    </Box>
  )
}
