import { useState } from 'react'
import {
  Box, Card, CardContent, Typography, TextField, Button, Alert, CircularProgress,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { changePassword as apiChangePassword } from '../api/auth'

const PASSWORD_RULES = {
  minLength: 8,
  requireLetter: /[a-zA-Z]/,
  requireDigit: /\d/,
}

function validatePassword(pw, t) {
  if (pw.length < PASSWORD_RULES.minLength) return t('changePassword.minLength')
  if (!PASSWORD_RULES.requireLetter.test(pw)) return t('changePassword.requireLetter')
  if (!PASSWORD_RULES.requireDigit.test(pw)) return t('changePassword.requireDigit')
  return ''
}

export default function ChangePasswordPage() {
  const { t } = useTranslation()
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value })
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const { currentPassword, newPassword, confirmPassword } = form
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError(t('changePassword.allRequired'))
      return
    }
    if (newPassword !== confirmPassword) {
      setError(t('changePassword.notMatch'))
      return
    }
    const pwError = validatePassword(newPassword, t)
    if (pwError) {
      setError(pwError)
      return
    }

    setLoading(true)
    try {
      await apiChangePassword({ currentPassword, newPassword })
      setSuccess(t('changePassword.success'))
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      const errorMessage = err?.response?.data || err?.message || t('changePassword.failed')
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
      <Card sx={{ width: 460, boxShadow: 3 }}>
        <CardContent sx={{ p: 2 }}>
          <Typography variant="h5" fontWeight={600} mb={3}>{t('changePassword.title')}</Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth label={t('changePassword.currentPassword')} type="password" size="small"
              value={form.currentPassword} onChange={handleChange('currentPassword')}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth label={t('changePassword.newPassword')} type="password" size="small"
              value={form.newPassword} onChange={handleChange('newPassword')}
              helperText={t('changePassword.helperText')}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth label={t('changePassword.confirmPassword')} type="password" size="small"
              value={form.confirmPassword} onChange={handleChange('confirmPassword')}
              sx={{ mb: 3 }}
            />
            <Button fullWidth type="submit" variant="contained" disabled={loading} sx={{ py: 1.2 }}>
              {loading ? <CircularProgress size={20} color="inherit" /> : t('changePassword.submit')}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
