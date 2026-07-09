import { useState, useEffect, useCallback } from 'react'
import { Tabs } from 'antd'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

interface TabItem {
  key: string
  label: string
}

const tabLabelMap: Record<string, string> = {
  '/home': '首页',
  '/workspace': '工作台',
  '/about': '关于',
  '/map/baidu': '百度地图',
  '/map/amap': '高德地图',
  '/map/openlayer': 'OpenLayer',
  '/map/cesium': 'Cesium 3D',
  '/system/user': '用户管理',
  '/system/role': '角色管理',
  '/system/menu': '菜单管理',
  '/system/settings': '系统设置',
  '/system/logs': '系统日志',
}

function TabView() {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeKey, setActiveKey] = useState(location.pathname)
  const [tabs, setTabs] = useState<TabItem[]>([{ key: location.pathname, label: tabLabelMap[location.pathname] || location.pathname }])

  useEffect(() => {
    const path = location.pathname
    if (path !== activeKey) {
      setActiveKey(path)
      const existingTab = tabs.find((t) => t.key === path)
      if (!existingTab) {
        setTabs((prev) => [...prev, { key: path, label: tabLabelMap[path] || path }])
      }
    }
  }, [location.pathname])

  const handleTabChange = (key: string) => {
    setActiveKey(key)
    navigate(key)
  }

  const handleTabClose = useCallback((key: string) => {
    setTabs((prev) => {
      const newTabs = prev.filter((t) => t.key !== key)
      if (newTabs.length === 0) {
        navigate('/home')
        return [{ key: '/home', label: '首页' }]
      }
      if (activeKey === key) {
        const nextKey = newTabs[0].key
        setActiveKey(nextKey)
        navigate(nextKey)
      }
      return newTabs
    })
  }, [activeKey])

  return (
    <div>
      <Tabs
        type="editable-card"
        activeKey={activeKey}
        onChange={handleTabChange}
        onEdit={(targetKey, action) => {
          if (action === 'remove') {
            handleTabClose(targetKey)
          }
        }}
        items={tabs.map((tab) => ({
          key: tab.key,
          label: tab.label,
          closable: tab.key !== '/home',
        }))}
        style={{ marginBottom: 16 }}
      />
      <Outlet />
    </div>
  )
}

export default TabView