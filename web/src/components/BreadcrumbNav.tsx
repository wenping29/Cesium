import { Breadcrumb } from 'antd'
import { useLocation } from 'react-router-dom'
import { useMemo } from 'react'

const breadcrumbMap: Record<string, string> = {
  '/': '首页',
  '/home': '首页',
  '/workspace': '工作台',
  '/about': '关于',
  '/map': '地图管理',
  '/map/baidu': '百度地图',
  '/map/amap': '高德地图',
  '/map/openlayer': 'OpenLayer',
  '/map/cesium': 'Cesium 3D',
  '/system': '系统管理',
  '/system/user': '用户管理',
  '/system/role': '角色管理',
  '/system/menu': '菜单管理',
  '/system/settings': '系统设置',
  '/system/logs': '系统日志',
}

const pathHierarchy: Record<string, string[]> = {
  '/map/baidu': ['/map', '/map/baidu'],
  '/map/amap': ['/map', '/map/amap'],
  '/map/openlayer': ['/map', '/map/openlayer'],
  '/map/cesium': ['/map', '/map/cesium'],
  '/system/user': ['/system', '/system/user'],
  '/system/role': ['/system', '/system/role'],
  '/system/menu': ['/system', '/system/menu'],
  '/system/settings': ['/system', '/system/settings'],
  '/system/logs': ['/system', '/system/logs'],
}

function BreadcrumbNav() {
  const { pathname } = useLocation()

  const items = useMemo(() => {
    const paths = pathHierarchy[pathname] ?? [pathname]
    return paths.map((p) => ({ title: breadcrumbMap[p] || p, key: p }))
  }, [pathname])

  return <Breadcrumb items={items} style={{ marginBottom: 16 }} />
}

export default BreadcrumbNav
