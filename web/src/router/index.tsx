import { createBrowserRouter, Navigate } from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import About from '../pages/About'
import Workspace from '../pages/Workspace'
import Login from '../pages/Login'
import Register from '../pages/Register'
import UserManage from '../pages/system/UserManage'
import RoleManage from '../pages/system/RoleManage'
import MenuManage from '../pages/system/MenuManage'
import Settings from '../pages/system/Settings'
import Logs from '../pages/system/Logs'
import BaiduMap from '../pages/map/BaiduMap'
import Amap from '../pages/map/Amap'
import OpenLayer from '../pages/map/OpenLayer'
import Cesium from '../pages/map/Cesium'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: 'home', element: <Home /> },
      { path: 'workspace', element: <Workspace /> },
      { path: 'about', element: <About /> },
      {
        path: 'map',
        children: [
          { path: 'baidu', element: <BaiduMap /> },
          { path: 'amap', element: <Amap /> },
          { path: 'openlayer', element: <OpenLayer /> },
          { path: 'cesium', element: <Cesium /> },
        ],
      },
      {
        path: 'system',
        children: [
          { index: true, element: <Navigate to="/system/settings" replace /> },
          { path: 'user', element: <UserManage /> },
          { path: 'role', element: <RoleManage /> },
          { path: 'menu', element: <MenuManage /> },
          { path: 'settings', element: <Settings /> },
          { path: 'logs', element: <Logs /> },
        ],
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
])

export default router
