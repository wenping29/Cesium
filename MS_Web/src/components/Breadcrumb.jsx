import { useLocation, useNavigate } from 'react-router-dom'
import { Breadcrumbs, Link, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

const breadcrumbMap = {
  '/workbench': { label: 'nav.workbench', parent: '/' },
  '/analysis': { label: 'nav.analysis', parent: '/' },
  '/dashboard': { label: 'nav.dashboard', parent: '/' },
  '/big-screen': { label: 'nav.bigScreen', parent: '/' },
  '/earthquake-table': { label: 'earthquakeTable.title', parent: '/dataTables' },
  '/typhoon-table': { label: 'typhoonTable.title', parent: '/dataTables' },
  '/wind-table': { label: 'windTable.title', parent: '/dataTables' },
  '/airquality-table': { label: 'airQualityTable.title', parent: '/dataTables' },
  '/user-management': { label: 'nav.userManagement', parent: '/permission' },
  '/role-management': { label: 'nav.roleManagement', parent: '/permission' },
  '/menu-management': { label: 'nav.menuManagement', parent: '/permission' },
  '/department-management': { label: 'nav.departmentManagement', parent: '/permission' },
  '/map': { label: 'nav.map', parent: '/maps' },
  '/openlayer-map': { label: 'nav.olMap', parent: '/maps' },
  '/leaflet-map': { label: 'nav.leafletMap', parent: '/maps' },
  '/image-to-bim': { label: 'nav.imageToBim', parent: '/' },
  '/attendance-report': { label: 'nav.openReport', parent: '/attendance' },
  '/workhour-report': { label: 'nav.workHourReport', parent: '/attendance' },
  '/leave-report': { label: 'nav.leaveReport', parent: '/attendance' },
  '/annual-leave-report': { label: 'nav.annualLeaveReport', parent: '/attendance' },
  '/profile': { label: 'nav.editProfile', parent: '/' },
  '/change-password': { label: 'nav.changePassword', parent: '/' },
  '/notifications': { label: 'nav.notifications', parent: '/' },
  '/send-notification': { label: 'nav.sendNotification', parent: '/' },
  '/settings/introduction': { label: '简介', parent: '/settingsGroup' },
  '/settings': { label: '设置', parent: '/settingsGroup' },
  '/settings/background': { label: '背景设置', parent: '/settingsGroup' },
  '/settings/dashboard': { label: '看板', parent: '/settingsGroup' },
  '/settings/projects': { label: '项目', parent: '/settingsGroup' },
  '/settings/faq': { label: '常见问题', parent: '/settingsGroup' },
  '/settings/users': { label: '用户', parent: '/settingsGroup' },
  '/settings/auth': { label: '认证', parent: '/settingsGroup' },
  '/settings/files': { label: '文件管理', parent: '/settingsGroup' },
  '/settings/chat': { label: '聊天', parent: '/settingsGroup' },
}

const groupMap = {
  '/': { label: 'nav.home', path: '/workbench' },
  '/dataTables': { label: 'nav.dataTables', path: '/earthquake-table' },
  '/permission': { label: 'nav.permissionManagement', path: '/user-management' },
  '/maps': { label: 'nav.mapCategory', path: '/map' },
  '/attendance': { label: 'nav.attendanceManagement', path: '/attendance-report' },
  '/settingsGroup': { label: '设置', path: '/settings/introduction' },
}

export default function Breadcrumb() {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()

  const getBreadcrumbs = () => {
    const breadcrumbs = []
    let currentPath = location.pathname

    while (currentPath) {
      const item = breadcrumbMap[currentPath]
      if (item) {
        breadcrumbs.unshift({ path: currentPath, label: typeof item.label === 'string' ? item.label : t(item.label) })

        if (item.parent && groupMap[item.parent]) {
          const group = groupMap[item.parent]
          breadcrumbs.unshift({ path: group.path, label: typeof group.label === 'string' ? group.label : t(group.label) })
          currentPath = null
        } else {
          currentPath = null
        }
      } else {
        currentPath = null
      }
    }

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <Breadcrumbs separator="›" sx={{ color: 'white' }}>
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1
        return isLast ? (
          <Typography key={crumb.path} sx={{ color: 'white', fontWeight: 'bold' }}>
            {crumb.label}
          </Typography>
        ) : (
          <Link
            key={crumb.path}
            underline="hover"
            color="inherit"
            onClick={() => navigate(crumb.path)}
            sx={{ cursor: 'pointer' }}
          >
            {crumb.label}
          </Link>
        )
      })}
    </Breadcrumbs>
  )
}