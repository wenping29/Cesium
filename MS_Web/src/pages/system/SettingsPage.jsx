import { Box, Typography, Paper, Card, CardContent, FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel, Divider } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'

export default function SettingsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        设置
      </Typography>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <SettingsIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h6">系统设置</Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>语言</InputLabel>
            <Select defaultValue="zh">
              <MenuItem value="zh">中文</MenuItem>
              <MenuItem value="en">English</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>主题</InputLabel>
            <Select defaultValue="light">
              <MenuItem value="light">浅色模式</MenuItem>
              <MenuItem value="dark">深色模式</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel control={<Switch defaultChecked />} label="启用通知" sx={{ mb: 2 }} />
          <FormControlLabel control={<Switch defaultChecked />} label="自动保存" sx={{ mb: 2 }} />
          <FormControlLabel control={<Switch />} label="显示提示信息" />
        </CardContent>
      </Card>
    </Box>
  )
}
