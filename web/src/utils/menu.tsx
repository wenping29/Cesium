import type { MenuItem } from '../store/slices/menuSlice'
import {
  HomeOutlined,
  DashboardOutlined,
  InfoCircleOutlined,
  CompassOutlined,
  EnvironmentOutlined,
  SettingOutlined,
  TeamOutlined,
  SafetyOutlined,
  MenuOutlined,
  FileTextOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'

const iconMap: Record<string, React.ReactNode> = {
  Home: <HomeOutlined />,
  Dashboard: <DashboardOutlined />,
  InfoCircle: <InfoCircleOutlined />,
  Compass: <CompassOutlined />,
  Environment: <EnvironmentOutlined />,
  Setting: <SettingOutlined />,
  Team: <TeamOutlined />,
  Safety: <SafetyOutlined />,
  Menu: <MenuOutlined />,
  FileText: <FileTextOutlined />,
  UnorderedList: <UnorderedListOutlined />,
}

export function convertMenuItems(menus: MenuItem[]): any[] {
  return menus.map((menu) => {
    const item: any = {
      key: menu.path || menu.id.toString(),
      icon: iconMap[menu.icon] || <HomeOutlined />,
      label: menu.name,
    }

    if (menu.children && menu.children.length > 0) {
      item.children = convertMenuItems(menu.children)
    }

    return item
  })
}

export function convertToTabLabels(menus: MenuItem[]): Record<string, string> {
  const labels: Record<string, string> = {}

  function traverse(items: MenuItem[]) {
    items.forEach((menu) => {
      if (menu.path) {
        labels[menu.path] = menu.name
      }
      if (menu.children && menu.children.length > 0) {
        traverse(menu.children)
      }
    })
  }

  traverse(menus)
  return labels
}

export function buildBreadcrumbMap(menus: MenuItem[]): Record<string, string> {
  const map: Record<string, string> = {
    '/': '首页',
  }

  function traverse(items: MenuItem[]) {
    items.forEach((menu) => {
      if (menu.path) {
        map[menu.path] = menu.name
      } else if (menu.children && menu.children.length > 0) {
        const parentPath = menu.children[0]?.path?.split('/').slice(0, -1).join('/')
        if (parentPath) {
          map[parentPath] = menu.name
        }
      }
      if (menu.children && menu.children.length > 0) {
        traverse(menu.children)
      }
    })
  }

  traverse(menus)
  return map
}

export function buildPathHierarchy(menus: MenuItem[]): Record<string, string[]> {
  const hierarchy: Record<string, string[]> = {}

  function traverse(items: MenuItem[], parentPaths: string[] = []) {
    items.forEach((menu) => {
      if (menu.path) {
        const paths = [...parentPaths, menu.path]
        hierarchy[menu.path] = paths
        if (menu.children && menu.children.length > 0) {
          traverse(menu.children, paths)
        }
      } else if (menu.children && menu.children.length > 0) {
        const parentPath = menu.children[0]?.path?.split('/').slice(0, -1).join('/')
        const newParentPaths = parentPath ? [...parentPaths, parentPath] : parentPaths
        traverse(menu.children, newParentPaths)
      }
    })
  }

  traverse(menus)
  return hierarchy
}