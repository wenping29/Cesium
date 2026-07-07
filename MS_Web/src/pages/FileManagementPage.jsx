import { Box, Typography, Paper, Card, CardContent, Button, List, ListItem, ListItemText, ListItemIcon, Divider, Grid } from '@mui/material'
import FolderIcon from '@mui/icons-material/Folder'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import UploadFileIcon from '@mui/icons-material/UploadFile'

const files = [
  { id: 1, name: '项目文档', type: 'folder', size: '-' },
  { id: 2, name: '设计稿', type: 'folder', size: '-' },
  { id: 3, name: '需求说明书.pdf', type: 'file', size: '2.5 MB' },
  { id: 4, name: '技术架构.docx', type: 'file', size: '1.2 MB' },
  { id: 5, name: '数据字典.xlsx', type: 'file', size: '856 KB' },
]

export default function FileManagementPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">文件管理</Typography>
        <Button variant="contained" startIcon={<UploadFileIcon />}>上传文件</Button>
      </Box>
      <Card>
        <CardContent>
          <List>
            {files.map((file, index) => (
              <Box key={file.id}>
                {index > 0 && <Divider />}
                <ListItem>
                  <ListItemIcon>
                    {file.type === 'folder' ? <FolderIcon sx={{ color: 'primary.main' }} /> : <InsertDriveFileIcon />}
                  </ListItemIcon>
                  <ListItemText primary={file.name} secondary={file.size !== '-' ? `大小: ${file.size}` : ''} />
                </ListItem>
              </Box>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  )
}
