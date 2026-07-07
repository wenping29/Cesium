import { Box, Typography, Paper, Card, CardContent, Grid, Button } from '@mui/material'
import WallpaperIcon from '@mui/icons-material/Wallpaper'

const backgrounds = [
  { id: 1, name: '默认背景', color: '#f5f5f5' },
  { id: 2, name: '深蓝色', color: '#1565c0' },
  { id: 3, name: '深紫色', color: '#7b1fa2' },
  { id: 4, name: '墨绿色', color: '#2e7d32' },
  { id: 5, name: '橙色', color: '#ef6c00' },
  { id: 6, name: '灰色', color: '#424242' },
]

export default function BackgroundSettingsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        背景设置
      </Typography>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <WallpaperIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h6">选择背景</Typography>
          </Box>

          <Grid container spacing={2}>
            {backgrounds.map((bg) => (
              <Grid item xs={12} sm={6} md={4} key={bg.id}>
                <Paper
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    bgcolor: bg.color,
                    color: ['#f5f5f5', '#424242'].includes(bg.color) ? 'text.primary' : 'common.white',
                    '&:hover': { opacity: 0.8 }
                  }}
                >
                  <Typography variant="body1">{bg.name}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Button variant="contained">上传自定义背景</Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
