import { useState, useEffect } from 'react'
import { Card, Typography, Row, Col, Statistic, Table, Calendar, Tag, Progress, Alert, Button } from 'antd'
import { 
  UserOutlined, 
  EyeOutlined,
  RiseOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons'

const { Title, Text } = Typography

interface Visitor {
  id: number
  name: string
  avatar: string
  time: string
  action: string
  ip: string
}

interface WorkLog {
  id: number
  title: string
  status: 'completed' | 'in-progress' | 'pending'
  priority: 'high' | 'medium' | 'low'
  date: string
  assignee: string
}

interface CalendarNote {
  date: string
  title: string
  type: 'meeting' | 'task' | 'holiday'
}

function Home() {
  const [visitors] = useState<Visitor[]>([
    { id: 1, name: '张三', avatar: '', time: '5分钟前', action: '登录系统', ip: '192.168.1.101' },
    { id: 2, name: '李四', avatar: '', time: '12分钟前', action: '查看用户管理', ip: '192.168.1.102' },
    { id: 3, name: '王五', avatar: '', time: '28分钟前', action: '编辑个人资料', ip: '192.168.1.103' },
    { id: 4, name: '赵六', avatar: '', time: '1小时前', action: '导出报表', ip: '192.168.1.104' },
    { id: 5, name: '钱七', avatar: '', time: '2小时前', action: '创建角色', ip: '192.168.1.105' },
  ])

  const [workLogs] = useState<WorkLog[]>([
    { id: 1, title: '完成用户管理模块开发', status: 'completed', priority: 'high', date: '2026-07-09', assignee: '张三' },
    { id: 2, title: '优化地图加载性能', status: 'in-progress', priority: 'high', date: '2026-07-09', assignee: '李四' },
    { id: 3, title: '编写API文档', status: 'in-progress', priority: 'medium', date: '2026-07-09', assignee: '王五' },
    { id: 4, title: '测试权限系统', status: 'pending', priority: 'medium', date: '2026-07-10', assignee: '赵六' },
    { id: 5, title: '部署到生产环境', status: 'pending', priority: 'low', date: '2026-07-11', assignee: '钱七' },
  ])

  const [calendarNotes] = useState<CalendarNote[]>([
    { date: '2026-07-09', title: '项目周会', type: 'meeting' },
    { date: '2026-07-10', title: '代码审查', type: 'task' },
    { date: '2026-07-11', title: '需求评审', type: 'meeting' },
    { date: '2026-07-12', title: '团建活动', type: 'holiday' },
    { date: '2026-07-15', title: '版本发布', type: 'task' },
  ])

  const [serverStatus, setServerStatus] = useState({
    cpu: 45,
    memory: 68,
    disk: 72,
    uptime: '15天 8小时',
    status: 'running' as const,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setServerStatus(prev => ({
        ...prev,
        cpu: Math.floor(Math.random() * 30) + 30,
        memory: Math.floor(Math.random() * 20) + 60,
        disk: Math.floor(Math.random() * 10) + 68,
      }))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const statusColor = {
    completed: 'green',
    'in-progress': 'blue',
    pending: 'default',
  }

  const statusLabel = {
    completed: '已完成',
    'in-progress': '进行中',
    pending: '待处理',
  }

  const priorityColor = {
    high: 'red',
    medium: 'orange',
    low: 'gray',
  }

  const priorityLabel = {
    high: '高',
    medium: '中',
    low: '低',
  }

  const noteTypeColor = {
    meeting: 'blue',
    task: 'green',
    holiday: 'red',
  }

  const noteTypeLabel = {
    meeting: '会议',
    task: '任务',
    holiday: '假期',
  }

  const visitorColumns = [
    {
      title: '访客',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1890ff', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {name.charAt(0)}
          </div>
          <span>{name}</span>
        </div>
      ),
    },
    { title: '操作', dataIndex: 'action', key: 'action' },
    { title: 'IP地址', dataIndex: 'ip', key: 'ip' },
    { title: '时间', dataIndex: 'time', key: 'time' },
  ]

  const workLogColumns = [
    { title: '标题', dataIndex: 'title', key: 'title' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={statusColor[status as keyof typeof statusColor]}>
          {statusLabel[status as keyof typeof statusLabel]}
        </Tag>
      ),
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <Tag color={priorityColor[priority as keyof typeof priorityColor]}>
          {priorityLabel[priority as keyof typeof priorityLabel]}
        </Tag>
      ),
    },
    { title: '日期', dataIndex: 'date', key: 'date' },
    { title: '负责人', dataIndex: 'assignee', key: 'assignee' },
  ]

  const getCalendarDateCell = (value: any) => {
    const dateStr = value.format('YYYY-MM-DD')
    const notes = calendarNotes.filter(n => n.date === dateStr)
    if (notes.length > 0) {
      return (
        <div>
          {value.date()}
          <div style={{ display: 'flex', gap: 2, marginTop: 4 }}>
            {notes.map((note, idx) => (
              <Tag key={idx} color={noteTypeColor[note.type]} style={{ fontSize: 10, padding: '0 4px' }}>
                {noteTypeLabel[note.type]}
              </Tag>
            ))}
          </div>
        </div>
      )
    }
    return value.date()
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={3} style={{ marginBottom: 24 }}>欢迎回来</Title>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="用户总数"
              value={1284}
              prefix={<UserOutlined />}
              suffix="人"
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <RiseOutlined style={{ color: '#52c41a' }} />
              <Text type="success">本周新增 23 人</Text>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="在线用户"
              value={45}
              prefix={<EyeOutlined />}
              suffix="人"
              valueStyle={{ color: '#52c41a' }}
            />
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <ClockCircleOutlined style={{ color: '#faad14' }} />
              <Text type="warning">最近活跃 5 分钟前</Text>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日访问"
              value={1256}
              prefix={<EyeOutlined />}
              suffix="次"
              valueStyle={{ color: '#722ed1' }}
            />
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <RiseOutlined style={{ color: '#52c41a' }} />
              <Text type="success">较昨日 +12%</Text>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="服务器状态"
              value={serverStatus.status === 'running' ? '正常' : '异常'}
              prefix={serverStatus.status === 'running' ? <CheckCircleOutlined /> : <InfoCircleOutlined />}
              valueStyle={{ color: serverStatus.status === 'running' ? '#52c41a' : '#fa541c' }}
            />
            <div style={{ marginTop: 12 }}>
              <Text type="secondary">运行时间: {serverStatus.uptime}</Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="服务器状态监控" extra={<Button type="link">查看详情</Button>}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text>CPU 使用率</Text>
                <Text>{serverStatus.cpu}%</Text>
              </div>
              <Progress percent={serverStatus.cpu} strokeColor="#1890ff" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text>内存使用率</Text>
                <Text>{serverStatus.memory}%</Text>
              </div>
              <Progress percent={serverStatus.memory} strokeColor="#52c41a" />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text>磁盘使用率</Text>
                <Text>{serverStatus.disk}%</Text>
              </div>
              <Progress percent={serverStatus.disk} strokeColor="#faad14" />
            </div>
            <Alert
              message="系统运行正常"
              description="所有服务器节点健康，无异常告警"
              type="success"
              showIcon
              style={{ marginTop: 16 }}
            />
          </Card>

          <Card title="最近访客" style={{ marginTop: 16 }}>
            <Table
              columns={visitorColumns}
              dataSource={visitors}
              pagination={false}
              rowKey="id"
              size="small"
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card title="日历备注" extra={<Button type="link">添加备注</Button>}>
            <Calendar cellRender={getCalendarDateCell} />
          </Card>

          <Card title="工作日志" style={{ marginTop: 16 }} extra={<Button type="link">新建日志</Button>}>
            <Table
              columns={workLogColumns}
              dataSource={workLogs}
              pagination={false}
              rowKey="id"
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Home