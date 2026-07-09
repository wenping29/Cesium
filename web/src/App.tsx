import { useEffect, useState, type ReactNode } from 'react'
import { Button, ConfigProvider, Dropdown, Layout, Menu, Space, Spin } from 'antd'
import {
  AppstoreOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons'
import { Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom'
import zhCN from 'antd/locale/zh_CN'
import enUS from 'antd/locale/en_US'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { setMenuMode, type MenuMode } from './store/slices/layoutSlice'
import { logout } from './store/slices/authSlice'
import { fetchMenus } from './store/slices/menuSlice'
import HeaderExtras from './components/HeaderExtras'
import { themeConfigs } from './theme/config'
import { convertMenuItems } from './utils/menu.tsx'

const { Header: AntHeader, Sider, Content, Footer } = Layout

const layoutOptions = [
  { value: 'header', label: '顶部菜单' },
  { value: 'sidebar', label: '侧栏菜单' },
  { value: 'sider-top', label: '通栏菜单' },
]

const antdLocales = { 'zh-CN': zhCN, 'en-US': enUS } as const

function LayoutSwitcher() {
  const dispatch = useAppDispatch()
  const themeName = useAppSelector((state) => state.theme.themeName)
  const fontColor = themeConfigs[themeName]?.headerFontColor || '#fff'

  const items = layoutOptions.map((opt) => ({
    key: opt.value,
    label: opt.label,
    onClick: () => dispatch(setMenuMode(opt.value as MenuMode)),
  }))

  return (
    <Dropdown menu={{ items }} trigger={['hover']} placement="bottomRight">
      <Button type="text" icon={<AppstoreOutlined />} style={{ color: fontColor, fontSize: 16 }} />
    </Dropdown>
  )
}

function HeaderLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const themeName = useAppSelector((state) => state.theme.themeName)
  const themeCfg = themeConfigs[themeName]
  const menus = useAppSelector((state) => state.menu.items)
  const menuLoading = useAppSelector((state) => state.menu.loading)

  const menuItems = convertMenuItems(menus)

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AntHeader
        style={{
          display: 'flex',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: themeCfg.headerBg,
        }}
      >
        <div
          style={{ color: themeCfg.headerFontColor, fontSize: 20, fontWeight: 'bold', marginRight: 40, whiteSpace: 'nowrap' }}
        >
          MyApp
        </div>
        {menuLoading ? (
          <Spin style={{ color: themeCfg.headerFontColor }} />
        ) : (
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            style={{ flex: 1, minWidth: 0, background: themeCfg.headerBg }}
          />
        )}
        <Space>
          <LayoutSwitcher />
          <HeaderExtras />
        </Space>
      </AntHeader>
      <Content>
        <Outlet />
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        MyApp ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  )
}

function SidebarLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const themeName = useAppSelector((state) => state.theme.themeName)
  const themeCfg = themeConfigs[themeName]
  const menus = useAppSelector((state) => state.menu.items)
  const menuLoading = useAppSelector((state) => state.menu.loading)

  const menuItems = convertMenuItems(menus)

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        theme="dark"
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          background: themeCfg.siderBg,
        }}
      >
        <div
          style={{
            color: themeCfg.headerFontColor,
            fontSize: collapsed ? 16 : 20,
            fontWeight: 'bold',
            textAlign: 'center',
            padding: '16px 0',
            whiteSpace: 'nowrap',
          }}
        >
          {collapsed ? 'M' : 'MyApp'}
        </div>
        {menuLoading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin />
          </div>
        ) : (
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            style={{ background: themeCfg.siderBg }}
          />
        )}
      </Sider>
      <Layout>
        <AntHeader
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            background: themeCfg.headerBg,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ color: themeCfg.headerFontColor, fontSize: 18 }}
          />
          <Space>
            <LayoutSwitcher />
            <HeaderExtras />
          </Space>
        </AntHeader>
        <Content
          style={{
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          MyApp ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  )
}

function SiderTopLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const themeName = useAppSelector((state) => state.theme.themeName)
  const themeCfg = themeConfigs[themeName]
  const menus = useAppSelector((state) => state.menu.items)
  const menuLoading = useAppSelector((state) => state.menu.loading)

  const menuItems = convertMenuItems(menus)

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AntHeader
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          position: 'sticky',
          top: 0,
          zIndex: 200,
          background: themeCfg.headerBg,
        }}
      >
        <Space>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ color: themeCfg.headerFontColor, fontSize: 18 }}
          />
          <span style={{ color: themeCfg.headerFontColor, fontSize: 20, fontWeight: 'bold', whiteSpace: 'nowrap' }}>
            MyApp
          </span>
        </Space>
        <Space>
          <LayoutSwitcher />
          <HeaderExtras />
        </Space>
      </AntHeader>
      <Layout style={{ flex: 1 }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          trigger={null}
          theme="dark"
          style={{
            position: 'sticky',
            top: 64,
            height: 'calc(100vh - 64px)',
            background: themeCfg.siderBg,
          }}
        >
          {menuLoading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Spin />
            </div>
          ) : (
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={[location.pathname]}
              items={menuItems}
              onClick={({ key }) => navigate(key)}
              style={{ background: themeCfg.siderBg, borderInlineEnd: 'none' }}
            />
          )}
        </Sider>
        <Layout>
          <Content style={{ overflow: 'auto' }}>
            <Outlet />
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            MyApp ©{new Date().getFullYear()}
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  )
}

function App() {
  const dispatch = useAppDispatch()
  const token = useAppSelector((state) => state.auth.token)
  const tokenExpiresAt = useAppSelector((state) => state.auth.tokenExpiresAt)
  const menuMode = useAppSelector((state) => state.layout.menuMode)
  const themeName = useAppSelector((state) => state.theme.themeName)
  const locale = useAppSelector((state) => state.locale.locale)
  const [expired, setExpired] = useState(false)

  const isExpired = !!token && !!tokenExpiresAt && Date.now() > tokenExpiresAt

  useEffect(() => {
    if (isExpired) {
      dispatch(logout())
      setExpired(true)
    }
  }, [isExpired])

  useEffect(() => {
    if (token) {
      dispatch(fetchMenus())
    }
  }, [token, dispatch])

  if (!token) {
    if (expired) {
      return <Navigate to="/login?expired=1" replace />
    }
    return <Navigate to="/login" replace />
  }

  const layoutMap: Record<MenuMode, ReactNode> = {
    header: <HeaderLayout />,
    sidebar: <SidebarLayout />,
    'sider-top': <SiderTopLayout />,
  }

  const cfg = themeConfigs[themeName]

  return (
    <ConfigProvider
      locale={antdLocales[locale]}
      theme={{ algorithm: cfg.algorithm, token: { colorPrimary: cfg.colorPrimary } }}
    >
      {layoutMap[menuMode]}
    </ConfigProvider>
  )
}

export default App
