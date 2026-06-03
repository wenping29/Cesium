import { Routes, Route, Navigate } from 'react-router-dom'
import { Box } from '@mui/material'
import useAuthStore from './store/authStore'
import NavBar from './components/NavBar'
import UsersPage from './pages/UsersPage'
import MapPage from './pages/MapPage'
import LoginPage from './pages/LoginPage'

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
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <Routes>
          <Route path="/users" element={<PrivateRoute><UsersPage /></PrivateRoute>} />
          <Route path="/map" element={<PrivateRoute><MapPage /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/users" replace />} />
        </Routes>
      </Box>
    </Box>
  )
}
