import { Box, Typography, Paper, Card, CardContent, FormControlLabel, Switch, Button, TextField } from '@mui/material'
import SecurityIcon from '@mui/icons-material/Security'

export default function AuthSettingsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        认证
      </Typography>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <SecurityIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h6">安全设置</Typography>
          </Box>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>登录设置</Typography>
          <FormControlLabel control={<Switch defaultChecked />} label="两步验证" sx={{ mb: 2, display: 'block' }} />
          <FormControlLabel control={<Switch defaultChecked />} label="记住登录状态" sx={{ mb: 2, display: 'block' }} />

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>会话超时</Typography>
          <TextField
            fullWidth
            type="number"
            label="超时时间（分钟）"
            defaultValue="30"
            sx={{ mb: 2 }}
          />

          <Box sx={{ mt: 3 }}>
            <Button variant="contained" color="error">撤销所有会话</Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
