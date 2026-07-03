import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Collapse,
  Divider,
  Tooltip
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import DashboardIcon from '@mui/icons-material/Dashboard'
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows'
import MapIcon from '@mui/icons-material/Map'
import LayersIcon from '@mui/icons-material/Layers'
import MapOutlinedIcon from '@mui/icons-material/MapOutlined'
import TableChartIcon from '@mui/icons-material/TableChart'
import VolcanoIcon from '@mui/icons-material/Volcano'
import StormIcon from '@mui/icons-material/Storm'
import WavesIcon from '@mui/icons-material/Waves'
import AirIcon from '@mui/icons-material/Air'
import PeopleIcon from '@mui/icons-material/People'
import InsightsIcon from '@mui/icons-material/Insights'
import SettingsIcon from '@mui/icons-material/Settings'
import ShieldIcon from '@mui/icons-material/Shield'
import BusinessIcon from '@mui/icons-material/Business'
import HomeIcon from '@mui/icons-material/Home'
import AnalyticsIcon from '@mui/icons-material/Analytics'
import ScheduleIcon from '@mui/icons-material/Schedule'
import DescriptionIcon from '@mui/icons-material/Description'
import TimerIcon from '@mui/icons-material/Timer'
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage'
import BeachAccessIcon from '@mui/icons-material/BeachAccess'
import { useTranslation } from 'react-i18next'
import sidebarStore from '../store/sidebarStore'

const DRAWER_WIDTH = 240
const DRAWER_COLLAPSED_WIDTH = 64

export default function SideBar() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { open } = sidebarStore()
  const [expandedMenus, setExpandedMenus] = useState(['home', 'dataTables', 'permission', 'attendance'])

  const toggleSubMenu = (menuId) => {
    setExpandedMenus(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    )
  }

  const isActive = (path) => location.pathname === path

  const menuItems = [
    {
      id: 'home',
      label: t('nav.home'),
      icon: <HomeIcon />,
      children: [
        { id: 'workbench', label: t('nav.workbench'), path: '/workbench', icon: <DashboardIcon /> },
        { id: 'analysis', label: t('nav.analysis'), path: '/analysis', icon: <AnalyticsIcon /> }
      ]
    },
    {
      id: 'dashboard',
      label: t('nav.dashboard'),
      path: '/dashboard',
      icon: <DashboardIcon />
    },
    {
      id: 'bigScreen',
      label: t('nav.bigScreen'),
      path: '/big-screen',
      icon: <DesktopWindowsIcon />
    },
    {
      id: 'maps',
      label: t('nav.mapCategory'),
      icon: <MapIcon />,
      children: [
        { id: 'cesiumMap', label: t('nav.map'), path: '/map', icon: <MapIcon /> },
        { id: 'olMap', label: t('nav.olMap'), path: '/openlayer-map', icon: <LayersIcon /> },
        { id: 'leafletMap', label: t('nav.leafletMap'), path: '/leaflet-map', icon: <MapOutlinedIcon /> }
      ]
    },
    {
      id: 'dataTables',
      label: t('nav.dataTables'),
      icon: <TableChartIcon />,
      children: [
        { id: 'earthquake', label: t('earthquakeTable.title'), path: '/earthquake-table', icon: <VolcanoIcon /> },
        { id: 'typhoon', label: t('typhoonTable.title'), path: '/typhoon-table', icon: <StormIcon /> },
        { id: 'wind', label: t('windTable.title'), path: '/wind-table', icon: <WavesIcon /> },
        { id: 'airQuality', label: t('airQualityTable.title'), path: '/airquality-table', icon: <AirIcon /> }
      ]
    },
    {
          id: 'permission',
          label: t('nav.permissionManagement'),
          icon: <SettingsIcon />,
          children: [
            { id: 'userMgmt', label: t('nav.userManagement'), path: '/user-management', icon: <PeopleIcon /> },
            { id: 'roleMgmt', label: t('nav.roleManagement'), path: '/role-management', icon: <ShieldIcon /> },
            { id: 'menuMgmt', label: t('nav.menuManagement'), path: '/menu-management', icon: <MenuIcon /> },
            { id: 'deptMgmt', label: t('nav.departmentManagement'), path: '/department-management', icon: <BusinessIcon /> }
          ]
        },
        {
          id: 'attendance',
          label: t('nav.attendanceManagement'),
          icon: <ScheduleIcon />,
          children: [
            { id: 'attendanceReport', label: t('nav.openReport'), path: '/attendance-report', icon: <DescriptionIcon /> },
            { id: 'workHourReport', label: t('nav.workHourReport'), path: '/workhour-report', icon: <TimerIcon /> },
            { id: 'leaveReport', label: t('nav.leaveReport'), path: '/leave-report', icon: <HolidayVillageIcon /> },
            { id: 'annualLeaveReport', label: t('nav.annualLeaveReport'), path: '/annual-leave-report', icon: <BeachAccessIcon /> }
          ]
        },
        {
      id: 'imageToBim',
      label: t('nav.imageToBim'),
      path: '/image-to-bim',
      icon: <InsightsIcon />
    }
  ]

  const renderMenuItem = (item) => {
    if (item.children) {
      const hasActiveChild = item.children.some(child => isActive(child.path))
      const isExpanded = expandedMenus.includes(item.id)

      return (
        <Box key={item.id}>
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={() => toggleSubMenu(item.id)}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                bgcolor: hasActiveChild ? 'rgba(0,0,0,0.08)' : 'transparent'
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : 'auto',
                  justifyContent: 'center',
                  color: hasActiveChild ? 'primary.main' : 'inherit'
                }}
              >
                {item.icon}
              </ListItemIcon>
              {open && (
                <ListItemText
                  primary={item.label}
                  sx={{ color: hasActiveChild ? 'primary.main' : 'inherit' }}
                />
              )}
              {open && (
                isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />
              )}
            </ListItemButton>
          </ListItem>
          {open && (
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.children.map(child => (
                  <ListItemButton
                    key={child.id}
                    onClick={() => navigate(child.path)}
                    sx={{
                      pl: 4,
                      minHeight: 40,
                      bgcolor: isActive(child.path) ? 'rgba(0,0,0,0.08)' : 'transparent'
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 32,
                        color: isActive(child.path) ? 'primary.main' : 'inherit'
                      }}
                    >
                      {child.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={child.label}
                      sx={{ color: isActive(child.path) ? 'primary.main' : 'inherit' }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          )}
        </Box>
      )
    }

    return (
      <ListItem key={item.id} disablePadding sx={{ display: 'block' }}>
        <Tooltip title={!open ? item.label : ''} placement="right" arrow>
          <ListItemButton
            onClick={() => navigate(item.path)}
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
              bgcolor: isActive(item.path) ? 'rgba(0,0,0,0.08)' : 'transparent'
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 2 : 'auto',
                justifyContent: 'center',
                color: isActive(item.path) ? 'primary.main' : 'inherit'
              }}
            >
              {item.icon}
            </ListItemIcon>
            {open && (
              <ListItemText
                primary={item.label}
                sx={{ color: isActive(item.path) ? 'primary.main' : 'inherit' }}
              />
            )}
          </ListItemButton>
        </Tooltip>
      </ListItem>
    )
  }

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: open ? DRAWER_WIDTH : DRAWER_COLLAPSED_WIDTH,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          '& .MuiDrawer-paper': {
            width: open ? DRAWER_WIDTH : DRAWER_COLLAPSED_WIDTH,
            height: 'calc(100% - 48px)',
            boxSizing: 'border-box',
            transition: 'width 0.3s ease',
            overflow: 'hidden'
          }
        }}
        open={open}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: 1,
            py: 1,
            minHeight: 64,
            backgroundColor: (theme) => theme.palette.background.contrastText,
            color: (theme) => theme.palette.text.contrastText
          }}
        >
          {open && (
            <Typography variant="h6" sx={{ cursor: 'pointer', flexGrow: 1, pl: 2 }} onClick={() => navigate('/dashboard')}>
              {t('nav.appTitle')}
            </Typography>
          )}
        </Box>
        <Divider />
        <List sx={{ flexGrow: 1, pt: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {menuItems.map(renderMenuItem)}
        </List>
      </Drawer>
    </>
  )
}

export { DRAWER_WIDTH, DRAWER_COLLAPSED_WIDTH }
