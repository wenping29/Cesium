import { useState } from 'react'
import { Avatar, Badge, Button, Dropdown, List, Modal, Popover, Space, Tag, Typography } from 'antd'
import {
  BellOutlined,
  BgColorsOutlined,
  GlobalOutlined,
  LogoutOutlined,
  ProfileOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { logout } from '../store/slices/authSlice'
import { setTheme, type ThemeName } from '../store/slices/themeSlice'
import { changeLocale } from '../store/slices/localeSlice'
import { t, type Locale } from '../i18n'
import { themeConfigs, themeOptions } from '../theme/config'

const localeOptions = [
  { value: 'zh-CN', label: '简体中文' },
  { value: 'en-US', label: 'English' },
]

function UserCenter() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const themeName = useAppSelector((state) => state.theme.themeName)
  const fontColor = themeConfigs[themeName]?.headerFontColor || '#fff'

  const items = [
    {
      key: 'profile',
      icon: <ProfileOutlined />,
      label: t('user.profile'),
    },
    { type: 'divider' as const },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('user.logout'),
      danger: true,
    },
  ]

  return (
    <Dropdown
      menu={{
        items,
        onClick: ({ key }) => {
          if (key === 'logout') {
            dispatch(logout())
            navigate('/login', { replace: true })
          }
        },
      }}
    >
      <Space style={{ cursor: 'pointer', color: fontColor }}>
        <Avatar size="small" icon={<UserOutlined />} />
        <span>{user?.name || 'User'}</span>
      </Space>
    </Dropdown>
  )
}

function ThemeSwitcher() {
  const dispatch = useAppDispatch()
  const themeName = useAppSelector((state) => state.theme.themeName)

  const content = (
    <Space direction="vertical" size="small">
      {themeOptions.map((opt) => (
        <Button
          key={opt.value}
          type={themeName === opt.value ? 'primary' : 'text'}
          size="small"
          block
          onClick={() => dispatch(setTheme(opt.value as ThemeName))}
          style={{ textAlign: 'left' }}
        >
          <Space>
            <span
              style={{
                display: 'inline-block',
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: opt.color,
              }}
            />
            {opt.label}
          </Space>
        </Button>
      ))}
    </Space>
  )

  return (
    <Popover content={content} trigger="hover" placement="bottomRight">
      <Button type="text" icon={<BgColorsOutlined />} style={{ color: '#fff', fontSize: 16 }} />
    </Popover>
  )
}

const { Text } = Typography

const mockNotifications = [
  { id: 1, title: '新用户注册', description: '用户 "张三" 刚刚注册了账号', time: '2分钟前', type: 'info' },
  { id: 2, title: '系统更新', description: '系统将于今晚 23:00 进行维护升级', time: '1小时前', type: 'warning' },
  { id: 3, title: '订单提醒', description: '您有 3 笔新订单待处理', time: '3小时前', type: 'error' },
  { id: 4, title: '任务完成', description: '数据导出任务已完成', time: '昨天', type: 'success' },
]

const typeLabels: Record<string, string> = { info: '信息', warning: '警告', error: '错误', success: '成功' }

function NotificationIcon() {
  const themeName = useAppSelector((state) => state.theme.themeName)
  const fontColor = themeConfigs[themeName]?.headerFontColor || '#fff'
  const [selected, setSelected] = useState<(typeof mockNotifications)[number] | null>(null)

  const content = (
    <div style={{ width: 320, maxHeight: 360 }}>
      <List
        size="small"
        dataSource={mockNotifications}
        renderItem={(item) => (
          <List.Item style={{ cursor: 'pointer' }} onClick={() => setSelected(item)}>
            <List.Item.Meta
              title={
                <Space>
                  <Text strong>{item.title}</Text>
                  <Tag color={item.type} style={{ fontSize: 10, lineHeight: '16px', padding: '0 4px' }}>
                    {typeLabels[item.type]}
                  </Tag>
                </Space>
              }
              description={
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>{item.description}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 11 }}>{item.time}</Text>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  )

  return (
    <>
      <Popover content={content} trigger="hover" placement="bottomRight">
        <Badge count={mockNotifications.length} size="small" offset={[2, -2]}>
          <Button type="text" icon={<BellOutlined />} style={{ color: fontColor, fontSize: 16 }} />
        </Badge>
      </Popover>
      <Modal
        title={selected?.title}
        open={!!selected}
        onCancel={() => setSelected(null)}
        footer={null}
      >
        <p><Text strong>类型：</Text><Tag color={selected?.type}>{selected ? typeLabels[selected.type] : ''}</Tag></p>
        <p><Text strong>内容：</Text>{selected?.description}</p>
        <p><Text strong>时间：</Text>{selected?.time}</p>
      </Modal>
    </>
  )
}

function LocaleSwitcher() {
  const dispatch = useAppDispatch()

  const items = localeOptions.map((opt) => ({
    key: opt.value,
    label: opt.label,
    onClick: () => dispatch(changeLocale(opt.value as Locale)),
  }))

  return (
    <Dropdown menu={{ items }} trigger={['hover']} placement="bottomRight">
      <Button type="text" icon={<GlobalOutlined />} style={{ color: '#fff', fontSize: 16 }} />
    </Dropdown>
  )
}

function HeaderExtras() {
  return (
    <Space size="small">
      <NotificationIcon />
      <ThemeSwitcher />
      <LocaleSwitcher />
      <UserCenter />
    </Space>
  )
}

export default HeaderExtras
