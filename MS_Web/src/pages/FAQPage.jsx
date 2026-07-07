import { Box, Typography, Paper, Card, CardContent, Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import HelpIcon from '@mui/icons-material/Help'

const faqs = [
  {
    question: '如何修改用户密码？',
    answer: '进入个人资料页面，点击修改密码，输入旧密码和新密码后保存即可。'
  },
  {
    question: '怎样创建新的项目？',
    answer: '在项目管理页面点击"新建项目"按钮，填写项目信息后保存。'
  },
  {
    question: '系统支持哪些浏览器？',
    answer: '推荐使用 Chrome、Firefox、Edge 等现代浏览器的最新版本。'
  },
  {
    question: '如何联系技术支持？',
    answer: '可以通过邮件 support@example.com 或在线客服联系我们。'
  },
  {
    question: '数据会自动备份吗？',
    answer: '是的，系统每天会自动备份数据，您也可以手动进行备份操作。'
  }
]

export default function FAQPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        常见问题
      </Typography>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <HelpIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h6">帮助中心</Typography>
          </Box>

          {faqs.map((faq, index) => (
            <Accordion key={index}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body1" fontWeight="medium">{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </CardContent>
      </Card>
    </Box>
  )
}
