import { Box, Typography, Paper, Card, CardContent, Grid, FormControlLabel, Switch } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'

export default function DashboardSettingsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        看板
      </Typography>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <DashboardIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h6">看板设置</Typography>
          </Box>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>显示组件</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControlLabel control={<Switch defaultChecked />} label="统计卡片" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel control={<Switch defaultChecked />} label="最近活动" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel control={<Switch defaultChecked />} label="通知列表" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel control={<Switch defaultChecked />} label="日历" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel control={<Switch />} label="快捷操作" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel control={<Switch />} label="项目概览" />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}
