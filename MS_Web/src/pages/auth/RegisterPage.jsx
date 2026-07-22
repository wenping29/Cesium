import { useState, useEffect } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import {
  Box, Card, TextField, Typography, Button, Alert, Link,
  InputAdornment, IconButton, FormControl, InputLabel, Select, MenuItem,
  Avatar, Switch, FormControlLabel,
} from '@mui/material'
import { Visibility, VisibilityOff, PhotoCamera } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { register } from '../../api/auth'
import { getDepartments } from '../../api/department'

export default function RegisterPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [departments, setDepartments] = useState([])
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    gender: '',
    address: '',
    hometown: '',
    avatar: '',
    bio: '',
    departmentId: '',
    isActive: true,
  })

  useEffect(() => {
    getDepartments().then(res => {
      const list = Array.isArray(res) ? res : []
      const flat = []
      const walk = (items) => {
        items.forEach(d => {
          flat.push(d)
          if (d.children?.length) walk(d.children)
        })
      }
      walk(list)
      setDepartments(flat)
    }).catch(() => {})
  }, [])

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value })
  }

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setFormData({ ...formData, avatar: reader.result })
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.username || !formData.email || !formData.password) {
      setError(t('login.validation'))
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError(t('register.passwordMismatch', '两次密码输入不一致'))
      return
    }
    setLoading(true)
    setError('')
    try {
      const { confirmPassword, ...payload } = formData
      payload.departmentId = formData.departmentId || null
      await register(payload)
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
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: 4,
    }}>
      <Card sx={{ p: 4, width: 480, boxShadow: 4 }}>
        <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 600, mb: 3 }}>
          {t('register.title', '注册账号')}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          {/* Avatar */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <Avatar
                src={formData.avatar}
                sx={{ width: 80, height: 80, fontSize: 32 }}
              >
                {formData.username?.[0]?.toUpperCase() || '?'}
              </Avatar>
              <IconButton
                component="label"
                size="small"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' },
                  width: 28,
                  height: 28,
                }}
              >
                <PhotoCamera sx={{ fontSize: 16 }} />
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleAvatarUpload}
                />
              </IconButton>
            </Box>
          </Box>

          {/* Username & Name */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              required
              label={t('login.username')}
              size="small"
              value={formData.username}
              onChange={handleChange('username')}
            />
            <TextField
              fullWidth
              label={t('register.name', '姓名')}
              size="small"
              value={formData.name}
              onChange={handleChange('name')}
            />
          </Box>

          {/* Email */}
          <TextField
            fullWidth
            required
            label={t('register.email', '邮箱')}
            size="small"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            sx={{ mb: 2 }}
          />

          {/* Password */}
          <TextField
            fullWidth
            required
            label={t('login.password')}
            type={showPassword ? 'text' : 'password'}
            size="small"
            value={formData.password}
            onChange={handleChange('password')}
            sx={{ mb: 2 }}
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

          {/* Confirm Password */}
          <TextField
            fullWidth
            required
            label={t('register.confirmPassword', '确认密码')}
            type={showConfirm ? 'text' : 'password'}
            size="small"
            value={formData.confirmPassword}
            onChange={handleChange('confirmPassword')}
            error={formData.confirmPassword !== '' && formData.password !== formData.confirmPassword}
            helperText={formData.confirmPassword !== '' && formData.password !== formData.confirmPassword ? t('register.passwordMismatch', '两次密码输入不一致') : ''}
            sx={{ mb: 2 }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirm(!showConfirm)}
                      edge="end"
                      size="small"
                    >
                      {showConfirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Phone & Gender */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label={t('register.phone', '电话')}
              size="small"
              value={formData.phone}
              onChange={handleChange('phone')}
            />
            <FormControl fullWidth size="small">
              <InputLabel>{t('register.gender', '性别')}</InputLabel>
              <Select
                value={formData.gender}
                onChange={handleChange('gender')}
                label={t('register.gender', '性别')}
              >
                <MenuItem value="">{t('common.none', '无')}</MenuItem>
                <MenuItem value="male">{t('register.genderMale', '男')}</MenuItem>
                <MenuItem value="female">{t('register.genderFemale', '女')}</MenuItem>
                <MenuItem value="other">{t('register.genderOther', '其他')}</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Department */}
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>{t('register.department', '部门')}</InputLabel>
            <Select
              value={formData.departmentId}
              onChange={handleChange('departmentId')}
              label={t('register.department', '部门')}
            >
              <MenuItem value="">{t('common.none', '无')}</MenuItem>
              {departments.map(d => (
                <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Address */}
          <TextField
            fullWidth
            label={t('register.address', '地址')}
            size="small"
            value={formData.address}
            onChange={handleChange('address')}
            sx={{ mb: 2 }}
          />

          {/* Hometown */}
          <TextField
            fullWidth
            label={t('register.hometown', '户籍')}
            size="small"
            value={formData.hometown}
            onChange={handleChange('hometown')}
            sx={{ mb: 2 }}
          />

          {/* Bio */}
          <TextField
            fullWidth
            label={t('register.bio', '简介')}
            size="small"
            multiline
            rows={3}
            value={formData.bio}
            onChange={handleChange('bio')}
            sx={{ mb: 2 }}
          />

          {/* IsActive */}
          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
            }
            label={t('register.isActive', '启用账号')}
            sx={{ mb: 3 }}
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
          <Link component={RouterLink} to="/login" underline="hover" sx={{ color: 'primary.main' }}>
            {t('register.goLogin', '去登录')}
          </Link>
        </Typography>
      </Card>
    </Box>
  )
}
