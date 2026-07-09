import { Button, Card, ConfigProvider, Flex, Form, Input, Typography, message } from 'antd'
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAppDispatch } from '../store/hooks'
import { setCredentials } from '../store/slices/authSlice'

const { Title } = Typography

interface RegisterForm {
  username: string
  email: string
  password: string
  confirmPassword: string
}

function Register() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [form] = Form.useForm<RegisterForm>()

  const onFinish = async (values: RegisterForm) => {
    try {
      const res: any = await axios.post('/api/auth/register', {
        username: values.username,
        email: values.email,
        password: values.password,
      })
      const { code, message: msg, data } = res.data
      if (code === 0) {
        dispatch(setCredentials(data))
        message.success('注册成功')
        navigate('/home', { replace: true })
      } else {
        message.error(msg)
      }
    } catch {
      message.error('注册失败，请重试')
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
            <Typography.Text type="secondary">创建新账号</Typography.Text>
          </Flex>
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
              <Input prefix={<UserOutlined />} placeholder="请输入用户名" size="large" />
            </Form.Item>
            <Form.Item
              name="email"
              label="邮箱"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="请输入邮箱" size="large" />
            </Form.Item>
            <Form.Item
              name="password"
              label="密码"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码至少 6 位' },
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" size="large" />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label="确认密码"
              dependencies={['password']}
              rules={[
                { required: true, message: '请确认密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'))
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="请确认密码" size="large" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large">
                注册
              </Button>
            </Form.Item>
          </Form>
          <Flex justify="center">
            <Typography.Text>
              已有账号？
              <Button type="link" onClick={() => navigate('/login')}>
                立即登录
              </Button>
            </Typography.Text>
          </Flex>
        </Card>
      </Flex>
    </ConfigProvider>
  )
}

export default Register
