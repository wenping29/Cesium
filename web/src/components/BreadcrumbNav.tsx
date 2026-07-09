import { Breadcrumb } from 'antd'
import { useLocation } from 'react-router-dom'
import { useMemo } from 'react'
import { useAppSelector } from '../store/hooks'
import { buildBreadcrumbMap, buildPathHierarchy } from '../utils/menu.tsx'

function BreadcrumbNav() {
  const { pathname } = useLocation()
  const menus = useAppSelector((state) => state.menu.items)

  const items = useMemo(() => {
    const breadcrumbMap = buildBreadcrumbMap(menus)
    const pathHierarchy = buildPathHierarchy(menus)
    const paths = pathHierarchy[pathname] ?? [pathname]
    return paths.map((p) => ({ title: breadcrumbMap[p] || p, key: p }))
  }, [pathname, menus])

  return <Breadcrumb items={items} style={{ marginBottom: 16 }} />
}

export default BreadcrumbNav
