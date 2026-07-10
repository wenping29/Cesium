import { Box, Typography, Paper, Card, CardContent } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'

export default function SettingsIntroductionPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        简介
      </Typography>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <InfoIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h6">系统简介</Typography>
          </Box>
          <Typography variant="body1" paragraph>
            欢迎使用我们的系统！这是一个功能强大的综合管理平台。
          </Typography>
          <Typography variant="body1" paragraph>
            本系统提供了丰富的功能模块，包括数据管理、地图可视化、用户权限管理、考勤管理等。
          </Typography>
          <Typography variant="body1">
            如需帮助，请查看常见问题或联系技术支持。
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}
