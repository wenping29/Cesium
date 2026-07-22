import { useState, useEffect } from 'react'
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
  Tooltip,
  CircularProgress
} from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { useTranslation } from 'react-i18next'
import sidebarStore from '../store/sidebarStore'
import useMenuStore from '../store/menuStore'
import { getIconComponent } from '../utils/iconMap'

const DRAWER_WIDTH = 240
const DRAWER_COLLAPSED_WIDTH = 64

export default function SideBar() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { open } = sidebarStore()
  const { menus, loading, fetchMenus } = useMenuStore()
  const [expandedMenu, setExpandedMenu] = useState(null)

  // 获取菜单数据
  useEffect(() => {
    fetchMenus()
    
  }, [fetchMenus])

  // 当路由变化时，自动展开包含当前活动路径的父菜单
  useEffect(() => {
    const findActiveParent = (items) => {
      for (const item of items) {
        if (item.children && item.children.length > 0) {
          const hasActiveChild = item.children.some(child => location.pathname === child.path)
          if (hasActiveChild) {
            return item.id
          }
          const found = findActiveParent(item.children)
          if (found) return found
        }
      }
      return null
    }
    const activeParentId = findActiveParent(menus)
    if (activeParentId) {
      setExpandedMenu(activeParentId)
    }
  }, [location.pathname, menus])

  const toggleSubMenu = (menuId) => {
    setExpandedMenu(prev =>
      prev === menuId ? null : menuId
    )
  }

  const isActive = (path) => location.pathname === path

  const renderMenuItem = (item) => {
    if (item.children && item.children.length > 0) {
      const hasActiveChild = item.children.some(child => isActive(child.path))
      const isExpanded = expandedMenu === item.id
      const IconComponent = getIconComponent(item.icon)

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
                {IconComponent ? <IconComponent /> : null}
              </ListItemIcon>
              {open && (
                <ListItemText
                  primary={item.name}
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
                {item.children.map(child => {
                  const ChildIcon = getIconComponent(child.icon)
                  return (
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
                        {ChildIcon ? <ChildIcon /> : null}
                      </ListItemIcon>
                      <ListItemText
                        primary={child.name}
                        sx={{ color: isActive(child.path) ? 'primary.main' : 'inherit' }}
                      />
                    </ListItemButton>
                  )
                })}
              </List>
            </Collapse>
          )}
        </Box>
      )
    }

    const IconComponent = getIconComponent(item.icon)

    return (
      <ListItem key={item.id} disablePadding sx={{ display: 'block' }}>
        <Tooltip title={!open ? item.name : ''} placement="right" arrow>
          <ListItemButton
            onClick={() => item.path && navigate(item.path)}
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
              {IconComponent ? <IconComponent /> : null}
            </ListItemIcon>
            {open && (
              <ListItemText
                primary={item.name}
                sx={{ color: isActive(item.path) ? 'primary.main' : 'inherit' }}
              />
            )}
          </ListItemButton>
        </Tooltip>
      </ListItem>
    )
  }

  if (loading) {
    return (
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            height: 'calc(100% - 48px)',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }
        }}
        open={open}
      >
        <CircularProgress />
      </Drawer>
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
            bgcolor: 'primary.main',
            color: 'common.white'
          }}
        >
          {open && (
            <Typography variant="h6" 
            sx={{ 
              cursor: 'pointer', 
              flexGrow: 1, pl: 2,
              color: 'common.white'
             }}
             onClick={() => navigate('/dashboard')}>
              {t('nav.appTitle')}
            </Typography>
          )}
        </Box>
        <Divider />
        <List sx={{ flexGrow: 1, pt: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {menus.map(renderMenuItem)}
        </List>
      </Drawer>
    </>
  )
}

export { DRAWER_WIDTH, DRAWER_COLLAPSED_WIDTH }
