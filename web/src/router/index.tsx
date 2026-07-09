import { createBrowserRouter, Navigate } from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import About from '../pages/About'
import Login from '../pages/Login'
import Register from '../pages/Register'
import UserManage from '../pages/system/UserManage'
import RoleManage from '../pages/system/RoleManage'
import MenuManage from '../pages/system/MenuManage'
import Settings from '../pages/system/Settings'
import Logs from '../pages/system/Logs'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: 'home', element: <Home /> },
      { path: 'about', element: <About /> },
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
