import { Box, Typography, Paper, Card, CardContent, Button, Avatar, List, ListItem, ListItemText, ListItemAvatar, Divider } from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import AddIcon from '@mui/icons-material/Add'

const users = [
  { id: 1, name: '张三', role: '管理员', email: 'zhangsan@example.com' },
  { id: 2, name: '李四', role: '普通用户', email: 'lisi@example.com' },
  { id: 3, name: '王五', role: '编辑', email: 'wangwu@example.com' },
]

export default function UsersSettingsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">用户</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>添加用户</Button>
      </Box>
      <Card>
        <CardContent>
          <List>
            {users.map((user, index) => (
              <Box key={user.id}>
                {index > 0 && <Divider />}
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>{user.name.charAt(0)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.name}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">{user.role}</Typography>
                        <Typography variant="caption" color="text.disabled">{user.email}</Typography>
                      </Box>
                    }
                  />
                </ListItem>
              </Box>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  )
}
