import { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import {
  Box, Card, TextField, Typography, Button, Alert, Link,
  InputAdornment, IconButton,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { register } from '../../api/auth'

export default function RegisterPage() {
  const { t } = useTranslation()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username || !email || !password) {
      setError(t('login.validation'))
      return
    }
    setLoading(true)
    setError('')
    try {
      await register({ username, email, password })
      navigate('/login', { replace: true })
    } catch (err) {
      const msg = err?.response?.data?.title || err?.response?.data || err?.message || t('login.failed')
      setError(typeof msg === 'string' ? msg : t('login.failed'))
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
          {t('register.title', '注册账号')}
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
            label={t('register.email', '邮箱')}
            size="small"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label={t('login.password')}
            type={showPassword ? 'text' : 'password'}
            size="small"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ py: 1.2 }}
          >
            {loading ? t('register.submitting', '注册中...') : t('register.title', '注册账号')}
          </Button>
        </Box>

        <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
          {t('register.hasAccount', '已有账号？')}{' '}
          <Link component={RouterLink} to="/login" underline="hover">
            {t('register.goLogin', '去登录')}
          </Link>
        </Typography>
      </Card>
    </Box>
  )
}
