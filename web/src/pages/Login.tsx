import { Alert, Button, Card, ConfigProvider, Flex, Form, Input, Typography, message } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { login } from '../api'
import { useAppDispatch } from '../store/hooks'
import { setCredentials } from '../store/slices/authSlice'

const { Title } = Typography

interface LoginForm {
  username: string
  password: string
}

function Login() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [form] = Form.useForm<LoginForm>()
  const [searchParams] = useSearchParams()
  const expired = searchParams.get('expired') === '1'

  const onFinish = async (values: LoginForm) => {
    try {
      const res: any = await login(values)
      const { code, message: msg, data } = res
      if (code === 0) {
        dispatch(setCredentials(data))
        message.success('登录成功')
        navigate('/home', { replace: true })
      } else {
        message.error(msg)
      }
    } catch {
      message.error('登录失败，请重试')
    }
  }

  return (
    <ConfigProvider>
      <Flex
        align="center"
        justify="center"
        style={{ minHeight: '100vh', background: '#f0f2f5' }}
      >
        <Card style={{ width: 400 }}>
          <Flex vertical align="center" style={{ marginBottom: 24 }}>
            <Title level={2} style={{ margin: 0 }}>MyApp</Title>
            <Typography.Text type="secondary">欢迎回来，请登录</Typography.Text>
          </Flex>
          {expired && (
            <Alert message="登录已过期，请重新登录" type="warning" showIcon style={{ marginBottom: 16 }} closable />
          )}
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              name="username"
              label="用户名"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="admin" size="large" />
            </Form.Item>
            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Admin123!" size="large" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large">
                登录
              </Button>
            </Form.Item>
          </Form>
          <Flex justify="center">
            <Typography.Text>
              还没有账号？
              <Button type="link" onClick={() => navigate('/register')}>
                立即注册
              </Button>
            </Typography.Text>
          </Flex>
        </Card>
      </Flex>
    </ConfigProvider>
  )
}

export default Login
