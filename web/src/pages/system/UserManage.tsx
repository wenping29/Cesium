import { useEffect, useState } from 'react'
import { Button, Card, Form, Input, Modal, Select, Space, Table, Tag, Typography, message } from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import request from '../../api/request'

const { Title } = Typography

interface UserItem {
  id: number
  username: string
  name: string
  email: string
  phone: string
  status: string
  createTime: string
}

interface SearchParams {
  username?: string
  email?: string
  status?: string
}

const statusMap: Record<string, { color: string; label: string }> = {
  active: { color: 'green', label: '正常' },
  inactive: { color: 'default', label: '未激活' },
  locked: { color: 'red', label: '锁定' },
}

function UserManage() {
  const [data, setData] = useState<UserItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [searchForm] = Form.useForm<SearchParams>()
  const [addForm] = Form.useForm()

  const fetchList = async (p: number, size?: number, params?: SearchParams) => {
    setLoading(true)
    try {
      const s = size || pageSize
      const query: Record<string, string | number> = { page: p, pageSize: s }
      if (params?.username) query.username = params.username
      if (params?.email) query.email = params.email
      if (params?.status) query.status = params.status

      const res: any = await request.get('/api/system/user/list', { params: query })
      setData(res.data.list)
      setTotal(res.data.total)
    } catch {
      message.error('获取用户列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchList(page, pageSize)
  }, [page])

  const handleSearch = () => {
    const values = searchForm.getFieldsValue()
    setPage(1)
    fetchList(1, pageSize, values)
  }

  const handleReset = () => {
    searchForm.resetFields()
    setPage(1)
    fetchList(1, pageSize)
  }

  const handleAdd = async () => {
    try {
      const values = await addForm.validateFields()
      const res: any = await request.post('/api/system/user', values)
      if (res.code === 0) {
        message.success('新增用户成功')
        setModalOpen(false)
        addForm.resetFields()
        setPage(1)
        fetchList(1, pageSize)
      }
    } catch {
      // validation or request error
    }
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    { title: '手机号', dataIndex: 'phone', key: 'phone' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => {
        const m = statusMap[s]
        return <Tag color={m?.color}>{m?.label || s}</Tag>
      },
    },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
  ]

  return (
    <div>
      <Title level={3}>用户管理</Title>
      <Card style={{ marginBottom: 16 }}>
        <Form form={searchForm} layout="inline">
          <Form.Item name="username">
            <Input placeholder="用户名" allowClear />
          </Form.Item>
          <Form.Item name="email">
            <Input placeholder="邮箱" allowClear />
          </Form.Item>
          <Form.Item name="status">
            <Select placeholder="状态" allowClear style={{ width: 120 }}>
              <Select.Option value="active">正常</Select.Option>
              <Select.Option value="inactive">未激活</Select.Option>
              <Select.Option value="locked">锁定</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>查询</Button>
              <Button onClick={handleReset}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
      <Card
        title="用户列表"
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>新增用户</Button>}
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50, 100],
            onChange: (p) => setPage(p),
            onShowSizeChange: (_p, size) => {
              setPageSize(size)
              setPage(1)
              fetchList(1, size)
            },
            showTotal: (t) => `共 ${t} 条`,
          }}
        />
      </Card>
      <Modal
        title="新增用户"
        open={modalOpen}
        onOk={handleAdd}
        onCancel={() => { setModalOpen(false); addForm.resetFields() }}
      >
        <Form form={addForm} layout="vertical">
          <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item name="name" label="姓名">
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item name="email" label="邮箱" rules={[{ required: true, type: 'email', message: '请输入有效邮箱' }]}>
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item name="phone" label="手机号">
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue="active">
            <Select>
              <Select.Option value="active">正常</Select.Option>
              <Select.Option value="inactive">未激活</Select.Option>
              <Select.Option value="locked">锁定</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default UserManage
