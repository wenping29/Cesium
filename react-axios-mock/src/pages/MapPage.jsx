import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import CesiumMap from '../components/CesiumMap'
import LayerControl from '../components/LayerControl'

export default function MapPage() {
  const [currentBasemap, setCurrentBasemap] = useState('tianditu_vec')

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
      <LayerControl 
        currentBasemap={currentBasemap} 
        onBasemapChange={setCurrentBasemap} 
      />
      <CesiumMap currentBasemap={currentBasemap} />
    </Box>
  )
}
