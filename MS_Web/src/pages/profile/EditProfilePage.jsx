import { useState } from 'react'
import {
  Box, Card, CardContent, Typography, TextField, Button, Avatar, Alert, CircularProgress, Select, MenuItem, FormControl, InputLabel, Divider, Grid, Paper,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import useAuthStore from '../../store/authStore'

export default function EditProfilePage() {
  const { t } = useTranslation()
  const { user, updateProfile } = useAuthStore()
  const [form, setForm] = useState({
    username: user?.username || '',
    name: user?.name || user?.username || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
    gender: user?.gender || '',
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
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
      <Paper sx={{ width: "100%", boxShadow: 3 }}>
        {/* <CardContent sx={{ p: 0 }}> */}
          <Grid container spacing={3}>
            <Grid sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        
                    <Avatar src={form.avatar} sx={{ width: 100, height: 100, border: '3px solid #e0e0e0' }} />
     
            </Grid>
          </Grid>
        {/* </CardContent> */}
          <Box sx={{ p: 4 }}>
            {success && <Alert severity="success" sx={{ mb: 4 }}>{t('profile.success')}</Alert>}
  
            <Box component="form" onSubmit={handleSubmit}>
              <Box sx={{ mb: 4 }}>
              
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{t('profile.username')}</Typography>
                    <TextField fullWidth size="small" value={form.username} disabled sx={{ bgcolor: '#f5f5f5' }} />
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{t('profile.name')}</Typography>
                    <TextField fullWidth size="small" value={form.name} onChange={handleChange('name')} />
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{t('profile.gender')}</Typography>
                    <FormControl fullWidth size="small">
                      <Select value={form.gender} onChange={handleChange('gender')}>
                        <MenuItem value="">{t('profile.genderSelect')}</MenuItem>
                        <MenuItem value="male">{t('profile.genderMale')}</MenuItem>
                        <MenuItem value="female">{t('profile.genderFemale')}</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#43a047', mr: 2 }} />
                  <Typography variant="subtitle1" fontWeight={600}>{t('profile.contactInfo')}</Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{t('profile.email')}</Typography>
                    <TextField fullWidth size="small" value={form.email} onChange={handleChange('email')} />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{t('profile.phone')}</Typography>
                    <TextField fullWidth size="small" value={form.phone} onChange={handleChange('phone')} />
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#fb8c00', mr: 2 }} />
                  <Typography variant="subtitle1" fontWeight={600}>{t('profile.addressInfo')}</Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{t('profile.address')}</Typography>
                    <TextField fullWidth size="small" value={form.address} onChange={handleChange('address')} />
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#7e57c2', mr: 2 }} />
                  <Typography variant="subtitle1" fontWeight={600}>{t('profile.avatarInfo')}</Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{t('profile.avatarUrl')}</Typography>
                    <TextField fullWidth size="small" value={form.avatar} onChange={handleChange('avatar')} placeholder={t('profile.avatarPlaceholder')} />
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 5 }}>
                <Button variant="outlined" onClick={() => window.location.reload()}>{t('common.cancel')}</Button>
                <Button type="submit" variant="contained" disabled={saving}>
                  {saving ? <CircularProgress size={20} color="inherit" /> : t('profile.save')}
                </Button>
              </Box>
            </Box>
          </Box>

          <Box sx={{ backgroundColor: '#f5f5f5', p: 3, textAlign: 'center', borderTop: '1px solid #e0e0e0' }}>
            <Typography variant="body2" color="text.secondary">
              {t('profile.footer')}
            </Typography>
          </Box>

      </Paper>
    </Box>
  )
}
