import { useState, useEffect, useCallback } from 'react'
import { Tabs } from 'antd'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'
import { convertToTabLabels } from '../utils/menu.tsx'

interface TabItem {
  key: string
  label: string
}

function TabView() {
  const location = useLocation()
  const navigate = useNavigate()
  const menus = useAppSelector((state) => state.menu.items)
  const [activeKey, setActiveKey] = useState(location.pathname)
  
  const tabLabelMap = convertToTabLabels(menus)
  
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

  const handleTabClose = useCallback((key: string | React.MouseEvent | React.KeyboardEvent) => {
    const targetKey = typeof key === 'string' ? key : ''
    setTabs((prev) => {
      const newTabs = prev.filter((t) => t.key !== targetKey)
      if (newTabs.length === 0) {
        navigate('/home')
        return [{ key: '/home', label: '首页' }]
      }
      if (activeKey === targetKey) {
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