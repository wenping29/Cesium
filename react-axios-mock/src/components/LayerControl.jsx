import { useState } from 'react'
import { Box, FormControl, InputLabel, Select, MenuItem, Paper, Typography } from '@mui/material'

const BASEMAP_OPTIONS = [
  { 
    id: 'tianditu_vec', 
    name: '天地图矢量', 
    type: 'tianditu',
    layer: 'vec',
    annotation: 'cva'
  },
  { 
    id: 'tianditu_img', 
    name: '天地图卫星', 
    type: 'tianditu',
    layer: 'img',
    annotation: 'cia'
  },
  { 
    id: 'tianditu_ter', 
    name: '天地图地形', 
    type: 'tianditu',
    layer: 'ter',
    annotation: 'cta'
  },
  { 
    id: 'amap_vec', 
    name: '高德街道图', 
    type: 'amap',
    layer: 'vec'
  },
  { 
    id: 'amap_img', 
    name: '高德卫星图', 
    type: 'amap',
    layer: 'img'
  },
  { 
    id: 'amap_traffic', 
    name: '高德交通图', 
    type: 'amap',
    layer: 'traffic'
  },
]

export default function LayerControl({ currentBasemap, onBasemapChange }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Paper
      sx={{
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 1000,
        p: 2,
        minWidth: 200,
        bgcolor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
        图层管理
      </Typography>
      <FormControl fullWidth size="small">
        <InputLabel>底图选择</InputLabel>
        <Select
          value={currentBasemap}
          label="底图选择"
          onChange={(e) => onBasemapChange(e.target.value)}
        >
          {BASEMAP_OPTIONS.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Paper>
  )
}

export { BASEMAP_OPTIONS }