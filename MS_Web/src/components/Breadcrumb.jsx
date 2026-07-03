import { useLocation, useNavigate } from 'react-router-dom'
import { Breadcrumbs, Link, Typography } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
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
}

const groupMap = {
  '/': { label: 'nav.home', path: '/workbench' },
  '/dataTables': { label: 'nav.dataTables', path: '/earthquake-table' },
  '/permission': { label: 'nav.permissionManagement', path: '/user-management' },
  '/maps': { label: 'nav.mapCategory', path: '/map' },
  '/attendance': { label: 'nav.attendanceManagement', path: '/attendance-report' },
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
        breadcrumbs.unshift({ path: currentPath, label: t(item.label) })
        
        if (item.parent && groupMap[item.parent]) {
          const group = groupMap[item.parent]
          breadcrumbs.unshift({ path: group.path, label: t(group.label) })
          currentPath = groupMap[group.parent]?.path || null
        } else {
          currentPath = null
        }
      } else {
        currentPath = null
      }
    }

    breadcrumbs.unshift({ path: '/workbench', label: t('nav.home'), icon: <HomeIcon fontSize="small" /> })
    
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <Breadcrumbs separator="›" sx={{ color: 'white' }}>
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1
        return isLast ? (
          <Typography key={crumb.path} sx={{ color: 'white', fontWeight: 'bold' }}>
            {crumb.icon}
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
            {crumb.icon}
            {crumb.label}
          </Link>
        )
      })}
    </Breadcrumbs>
  )
}