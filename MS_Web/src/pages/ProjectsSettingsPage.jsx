import { Box, Typography, Paper, Card, CardContent, Button, List, ListItem, ListItemText, ListItemIcon, Divider } from '@mui/material'
import FolderIcon from '@mui/icons-material/Folder'
import AddIcon from '@mui/icons-material/Add'

const projects = [
  { id: 1, name: '智慧城市项目', description: '城市数据可视化平台' },
  { id: 2, name: '气象监测系统', description: '气象数据采集与分析' },
  { id: 3, name: '应急指挥平台', description: '突发事件指挥调度' },
]

export default function ProjectsSettingsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">项目</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>新建项目</Button>
      </Box>
      <Card>
        <CardContent>
          <List>
            {projects.map((project, index) => (
              <Box key={project.id}>
                {index > 0 && <Divider />}
                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <ListItemText primary={project.name} secondary={project.description} />
                </ListItem>
              </Box>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  )
}
