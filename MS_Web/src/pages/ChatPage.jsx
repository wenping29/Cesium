import { Box, Typography, Paper, Card, CardContent, TextField, Button, List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import ChatIcon from '@mui/icons-material/Chat'

const messages = [
  { id: 1, sender: '张三', content: '大家好，今天的会议几点开始？', time: '09:30', isSelf: false },
  { id: 2, sender: '我', content: '10点钟在会议室A', time: '09:32', isSelf: true },
  { id: 3, sender: '李四', content: '好的，我会准时参加', time: '09:35', isSelf: false },
  { id: 4, sender: '我', content: '记得带上相关资料', time: '09:36', isSelf: true },
]

export default function ChatPage() {
  return (
    <Box sx={{ p: 3, height: 'calc(100vh - 180px)', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <ChatIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Typography variant="h4">聊天</Typography>
      </Box>

      <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                display: 'flex',
                justifyContent: msg.isSelf ? 'flex-end' : 'flex-start',
              }}
            >
              <Paper
                sx={{
                  p: 2,
                  maxWidth: '70%',
                  bgcolor: msg.isSelf ? 'primary.main' : 'background.paper',
                  color: msg.isSelf ? 'common.white' : 'text.primary',
                }}
              >
                {!msg.isSelf && (
                  <Typography variant="caption" display="block" gutterBottom>
                    {msg.sender}
                  </Typography>
                )}
                <Typography variant="body1">{msg.content}</Typography>
                <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block', textAlign: 'right' }}>
                  {msg.time}
                </Typography>
              </Paper>
            </Box>
          ))}
        </CardContent>

        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            placeholder="输入消息..."
            size="small"
          />
          <Button variant="contained" endIcon={<SendIcon />}>发送</Button>
        </Box>
      </Card>
    </Box>
  )
}
