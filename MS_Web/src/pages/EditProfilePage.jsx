import { useState } from 'react'
import {
  Box, Card, CardContent, Typography, TextField, Button, Avatar, Alert, CircularProgress,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import useAuthStore from '../store/authStore'

export default function EditProfilePage() {
  const { t } = useTranslation()
  const { user, updateProfile } = useAuthStore()
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSuccess(false)
    try {
      await updateProfile(form)
      setSuccess(true)
    } catch {
      setSuccess(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
      <Card sx={{ width: 520, boxShadow: 3 }}>
        <CardContent sx={{ p: 2 }}>
          <Typography variant="h5" fontWeight={600} mb={3}>{t('profile.title')}</Typography>

          {success && <Alert severity="success" sx={{ mb: 2 }}>{t('profile.success')}</Alert>}

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar src={form.avatar} sx={{ width: 80, height: 80, mb: 1 }} />
            <Typography variant="body2" color="text.secondary">{t('profile.avatarUrl')}</Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField fullWidth label={t('profile.avatarUrl')} size="small" value={form.avatar} onChange={handleChange('avatar')} sx={{ mb: 2 }} />
            <TextField fullWidth label={t('profile.name')} size="small" value={form.name} onChange={handleChange('name')} sx={{ mb: 2 }} />
            <TextField fullWidth label={t('profile.phone')} size="small" value={form.phone} onChange={handleChange('phone')} sx={{ mb: 2 }} />
            <TextField fullWidth label={t('profile.email')} size="small" value={form.email} onChange={handleChange('email')} sx={{ mb: 2 }} />
            <TextField fullWidth label={t('profile.bio')} size="small" multiline rows={3} value={form.bio} onChange={handleChange('bio')} sx={{ mb: 3 }} />
            <Button fullWidth type="submit" variant="contained" disabled={saving} sx={{ py: 1.2 }}>
              {saving ? <CircularProgress size={20} color="inherit" /> : t('profile.save')}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
