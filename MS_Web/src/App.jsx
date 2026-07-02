import { Routes, Route, Navigate } from 'react-router-dom'
import { Box } from '@mui/material'
import useAuthStore from './store/authStore'
import NavBar from './components/NavBar'
import SideBar from './components/SideBar'
import UsersPage from './pages/UsersPage'
import MapPage from './pages/MapPage'
import LoginPage from './pages/LoginPage'
import EditProfilePage from './pages/EditProfilePage'
import ChangePasswordPage from './pages/ChangePasswordPage'
import DashboardPage from './pages/DashboardPage'
import BigScreenPage from './pages/BigScreenPage'
import EarthquakeTablePage from './pages/EarthquakeTablePage'
import TyphoonTablePage from './pages/TyphoonTablePage'
import WindTablePage from './pages/WindTablePage'
import AirQualityTablePage from './pages/AirQualityTablePage'
import OpenLayerMapPage from './pages/OpenLayerMapPage'
import LeafletMapPage from './pages/LeafletMapPage'
import ImageToBimPage from './pages/ImageToBimPage'
import UserManagementPage from './pages/UserManagementPage'
import RoleManagementPage from './pages/RoleManagementPage'
import MenuManagementPage from './pages/MenuManagementPage'
import DepartmentManagementPage from './pages/DepartmentManagementPage'

function PrivateRoute({ children }) {
  const token = useAuthStore((s) => s.token)
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  const token = useAuthStore((s) => s.token)

  if (!token) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <NavBar />
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <SideBar />
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          <Routes>
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
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  )
}
