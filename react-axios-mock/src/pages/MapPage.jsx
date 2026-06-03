import { Box, Typography } from '@mui/material'
import CesiumMap from '../components/CesiumMap'

export default function MapPage() {
  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
      <Typography
        variant="h6"
        sx={{
          position: 'absolute', top: 16, left: 16, zIndex: 10,
          color: 'white', bgcolor: 'rgba(0,0,0,0.5)', px: 2, py: 0.5, borderRadius: 1,
        }}
      >
        Cesium 3D Map
      </Typography>
      <CesiumMap />
    </Box>
  )
}
