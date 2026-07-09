import { Typography, Row, Col, Card, Statistic, Tag } from 'antd'
import { 
  AimOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  WarningOutlined,
  RiseOutlined,
  FileTextOutlined,
  UserOutlined,
  MessageOutlined
} from '@ant-design/icons'

const { Title } = Typography

function Workspace() {
  return (
    <div style={{ padding: '24px' }}>
      <Title level={2} style={{ marginBottom: 24 }}>工作台</Title>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="待办任务"
              value={12}
              prefix={<AimOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="进行中"
              value={8}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已完成"
              value={156}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日新增"
              value={5}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={16}>
          <Card title="最近活动" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#1890ff', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                <FileTextOutlined />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold' }}>完成了用户管理模块文档</div>
                <div style={{ color: '#999', fontSize: 12 }}>2026-07-09 14:30</div>
              </div>
              <Tag color="green">已完成</Tag>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#52c41a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                <UserOutlined />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold' }}>新增用户：张三</div>
                <div style={{ color: '#999', fontSize: 12 }}>2026-07-09 13:20</div>
              </div>
              <Tag color="blue">进行中</Tag>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#faad14', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                <MessageOutlined />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold' }}>收到新消息通知</div>
                <div style={{ color: '#999', fontSize: 12 }}>2026-07-09 11:45</div>
              </div>
              <Tag color="orange">待处理</Tag>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', padding: '12px 0' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#fa541c', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                <WarningOutlined />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold' }}>服务器异常告警</div>
                <div style={{ color: '#999', fontSize: 12 }}>2026-07-09 10:30</div>
              </div>
              <Tag color="red">紧急</Tag>
            </div>
          </Card>
        </Col>

        <Col span={8}>
          <Card title="快捷操作">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              <div style={{ padding: 16, background: '#f5f5f5', borderRadius: 8, textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>📋</div>
                <div style={{ fontSize: 14, fontWeight: 'bold' }}>新建任务</div>
              </div>
              <div style={{ padding: 16, background: '#f5f5f5', borderRadius: 8, textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>📊</div>
                <div style={{ fontSize: 14, fontWeight: 'bold' }}>查看报表</div>
              </div>
              <div style={{ padding: 16, background: '#f5f5f5', borderRadius: 8, textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>📧</div>
                <div style={{ fontSize: 14, fontWeight: 'bold' }}>发送通知</div>
              </div>
              <div style={{ padding: 16, background: '#f5f5f5', borderRadius: 8, textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>🔔</div>
                <div style={{ fontSize: 14, fontWeight: 'bold' }}>我的提醒</div>
              </div>
            </div>
          </Card>

          <Card title="任务分类" style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
              <span>开发任务</span>
              <Tag color="blue">6</Tag>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
              <span>测试任务</span>
              <Tag color="green">3</Tag>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
              <span>文档编写</span>
              <Tag color="orange">2</Tag>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
              <span>会议安排</span>
              <Tag color="purple">1</Tag>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Workspace