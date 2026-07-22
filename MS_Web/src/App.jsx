import { useEffect, useRef } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Box } from '@mui/material'
import { recordVisit } from './api/visitorLogs'
import useAuthStore from './store/authStore'
import tabStore from './store/tabStore'
import Header from './Layout/Header'
import SideBar from './Layout/SideBar'
import TabBar from './Layout/TabBar'
import Footer from './Layout/Footer'

import UserManagementPage from './pages/user/UserManagementPage'
import UsersPage from './pages/user/UsersPage'
import UsersSettingsPage from './pages/user/UsersSettingsPage'

import ChangePasswordPage from './pages/ChangePasswordPage'
import DashboardPage from './pages/DashboardPage'
import BigScreenPage from './pages/BigScreenPage'
import EarthquakeTablePage from './pages/EarthquakeTablePage'
import TyphoonTablePage from './pages/TyphoonTablePage'
import WindTablePage from './pages/WindTablePage'
import AirQualityTablePage from './pages/AirQualityTablePage'

import OpenLayerMapPage from './pages/Map/OpenLayerMapPage'
import LeafletMapPage from './pages/Map/LeafletMapPage'
import MapPage from './pages/Map/MapPage'

import ImageToBimPage from './pages/ImageToBimPage'
import AuditLogReportPage from './pages/AuditLogReportPage'
import EditProfilePage from './pages/profile/EditProfilePage'

import MenuManagementPage from './pages/MenuManagementPage'
import DepartmentManagementPage from './pages/DepartmentManagementPage'
import WorkbenchPage from './pages/WorkbenchPage'
import AnalysisPage from './pages/AnalysisPage'
import AttendanceReportPage from './pages/AttendanceReportPage'
import WorkHourReportPage from './pages/WorkHourReportPage'
import LeaveReportPage from './pages/LeaveReportPage'
import AnnualLeaveReportPage from './pages/AnnualLeaveReportPage'
import NotificationsPage from './pages/NotificationsPage'
import SendMessagePage from './pages/SendMessagePage'

import SettingsPage from './pages/system/SettingsPage'
import SettingsIntroductionPage from './pages/system/SettingsIntroductionPage'
import VisitorLogReportPage from './pages/system/VisitorLogReportPage'

import BackgroundSettingsPage from './pages/BackgroundSettingsPage'
import DashboardSettingsPage from './pages/DashboardSettingsPage'
import ProjectsSettingsPage from './pages/ProjectsSettingsPage'
import FAQPage from './pages/FAQPage'

import LoginPage from './pages/auth/LoginPage'
import LoginLogReportPage from './pages/auth/LoginLogReportPage'
import RoleManagementPage from './pages/auth/RoleManagementPage'
import AuthSettingsPage from './pages/auth/AuthSettingsPage'

import FileManagementPage from './pages/FileManagementPage'
import ChatPage from './pages/ChatPage'

function PrivateRoute({ children }) {
  const token = useAuthStore((s) => s.token)
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  const token = useAuthStore((s) => s.token)
  const location = useLocation()
  const addTab = tabStore((s) => s.addTab)

  const pageTitles = {
    '/workbench': '工作台',
    '/analysis': '数据分析',
    '/dashboard': '仪表盘',
    '/big-screen': '大屏展示',
    '/earthquake-table': '地震数据',
    '/typhoon-table': '台风数据',
    '/wind-table': '风力数据',
    '/airquality-table': '空气质量',
    '/user-management': '用户管理',
    '/role-management': '角色管理',
    '/menu-management': '菜单管理',
    '/department-management': '部门管理',
    '/map': '地图',
    '/openlayer-map': 'OpenLayer地图',
    '/leaflet-map': 'Leaflet地图',
    '/image-to-bim': '影像转BIM',
    '/login-log-report': '登录日志',
    '/audit-log-report': '查询日志',
    '/visitor-log-report': '访客日志',
    '/attendance-report': '打卡报表',
    '/workhour-report': '工时报表',
    '/leave-report': '休假报表',
    '/annual-leave-report': '年假报表',
    '/notifications': '通知中心',
    '/send-notification': '发送消息',
    '/profile': '个人资料',
    '/change-password': '修改密码',
    '/settings/introduction': '简介',
    '/settings': '设置',
    '/settings/background': '背景设置',
    '/settings/dashboard': '看板',
    '/settings/projects': '项目',
    '/settings/faq': '常见问题',
    '/settings/users': '个人资料',
    '/settings/auth': '认证',
    '/settings/files': '文件管理',
    '/settings/chat': '聊天',
  }

  const prevPath = useRef('')

  useEffect(() => {
    const title = pageTitles[location.pathname]
    if (title) {
      addTab(location.pathname, title)
    }
  }, [location.pathname, addTab])

  useEffect(() => {
    if (location.pathname === prevPath.current) return
    prevPath.current = location.pathname
    recordVisit({
      pageUrl: location.pathname,
      referrer: document.referrer || undefined,
      userAgent: navigator.userAgent,
    })
  }, [location.pathname])

  if (!token) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
      <SideBar />
      <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column', overflow: 'hidden' }}>
        <Header />
        <TabBar />
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <Routes>
              <Route path="/workbench" element={<PrivateRoute><WorkbenchPage /></PrivateRoute>} />
              <Route path="/analysis" element={<PrivateRoute><AnalysisPage /></PrivateRoute>} />
              <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
              <Route path="/big-screen" element={<PrivateRoute><BigScreenPage /></PrivateRoute>} />
              <Route path="/earthquake-table" element={<PrivateRoute><EarthquakeTablePage /></PrivateRoute>} />
              <Route path="/typhoon-table" element={<PrivateRoute><TyphoonTablePage /></PrivateRoute>} />
              <Route path="/wind-table" element={<PrivateRoute><WindTablePage /></PrivateRoute>} />
              <Route path="/airquality-table" element={<PrivateRoute><AirQualityTablePage /></PrivateRoute>} />
              <Route path="/users" element={<PrivateRoute><UsersPage /></PrivateRoute>} />
              <Route path="/user-management" element={<PrivateRoute><UserManagementPage /></PrivateRoute>} />
              <Route path="/role-management" element={<PrivateRoute><RoleManagementPage /></PrivateRoute>} />
              <Route path="/menu-management" element={<PrivateRoute><MenuManagementPage /></PrivateRoute>} />
              <Route path="/department-management" element={<PrivateRoute><DepartmentManagementPage /></PrivateRoute>} />
              <Route path="/map" element={<PrivateRoute><MapPage /></PrivateRoute>} />
              <Route path="/openlayer-map" element={<PrivateRoute><OpenLayerMapPage /></PrivateRoute>} />
              <Route path="/leaflet-map" element={<PrivateRoute><LeafletMapPage /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><EditProfilePage /></PrivateRoute>} />
              <Route path="/change-password" element={<PrivateRoute><ChangePasswordPage /></PrivateRoute>} />
              <Route path="/image-to-bim" element={<PrivateRoute><ImageToBimPage /></PrivateRoute>} />
              <Route path="/login-log-report" element={<PrivateRoute><LoginLogReportPage /></PrivateRoute>} />
              <Route path="/audit-log-report" element={<PrivateRoute><AuditLogReportPage /></PrivateRoute>} />
              <Route path="/attendance-report" element={<PrivateRoute><AttendanceReportPage /></PrivateRoute>} />
              <Route path="/workhour-report" element={<PrivateRoute><WorkHourReportPage /></PrivateRoute>} />
              <Route path="/leave-report" element={<PrivateRoute><LeaveReportPage /></PrivateRoute>} />
              <Route path="/annual-leave-report" element={<PrivateRoute><AnnualLeaveReportPage /></PrivateRoute>} />
              <Route path="/notifications" element={<PrivateRoute><NotificationsPage /></PrivateRoute>} />
              <Route path="/send-notification" element={<PrivateRoute><SendMessagePage /></PrivateRoute>} />
              <Route path="/visitor-log-report" element={<PrivateRoute><VisitorLogReportPage /></PrivateRoute>} />
              <Route path="/settings/introduction" element={<PrivateRoute><SettingsIntroductionPage /></PrivateRoute>} />
              <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
              <Route path="/settings/background" element={<PrivateRoute><BackgroundSettingsPage /></PrivateRoute>} />
              <Route path="/settings/dashboard" element={<PrivateRoute><DashboardSettingsPage /></PrivateRoute>} />
              <Route path="/settings/projects" element={<PrivateRoute><ProjectsSettingsPage /></PrivateRoute>} />
              <Route path="/settings/faq" element={<PrivateRoute><FAQPage /></PrivateRoute>} />
              <Route path="/settings/users" element={<PrivateRoute><EditProfilePage /></PrivateRoute>} />
              <Route path="/settings/auth" element={<PrivateRoute><AuthSettingsPage /></PrivateRoute>} />
              <Route path="/settings/files" element={<PrivateRoute><FileManagementPage /></PrivateRoute>} />
              <Route path="/settings/chat" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
              <Route path="*" element={<Navigate to="/workbench" replace />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Box>
  )
}
