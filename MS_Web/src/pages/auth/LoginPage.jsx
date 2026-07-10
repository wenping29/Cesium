import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Card, TextField, Typography, Button, Alert,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import useAuthStore from '../../store/authStore'

function getDeviceInfo() {
  const ua = navigator.userAgent
  let browserInfo = 'Unknown'
  if (ua.includes('Chrome')) browserInfo = 'Chrome'
  else if (ua.includes('Firefox')) browserInfo = 'Firefox'
  else if (ua.includes('Safari')) browserInfo = 'Safari'
  else if (ua.includes('Edge')) browserInfo = 'Edge'
  else if (ua.includes('MSIE') || ua.includes('Trident')) browserInfo = 'Internet Explorer'

  let osInfo = 'Unknown'
  if (ua.includes('Windows')) osInfo = 'Windows'
  else if (ua.includes('Mac OS')) osInfo = 'macOS'
  else if (ua.includes('Linux')) osInfo = 'Linux'
  else if (ua.includes('Android')) osInfo = 'Android'
  else if (ua.includes('iPhone') || ua.includes('iPad')) osInfo = 'iOS'

  return {
    deviceInfo: window.screen ? `${window.screen.width}x${window.screen.height}` : 'Unknown',
    browserInfo,
    osInfo,
  }
}

export default function LoginPage() {
  const { t } = useTranslation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const deviceInfo = useMemo(() => getDeviceInfo(), [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username || !password) { setError(t('login.validation')); return }
    setLoading(true)
    setError('')
    try {
      await login({ username, password, ...deviceInfo })
      navigate('/users', { replace: true })
    } catch (err) {
      const errorMessage = err?.response?.data || err?.message || t('login.failed')
      setError(errorMessage)
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
        <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 600, mb: 3 }}>
          {t('login.title')}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label={t('login.username')}
            size="small"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label={t('login.password')}
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
            {loading ? t('login.loggingIn') : t('login.title')}
          </Button>
        </Box>
      </Card>
    </Box>
  )
}
