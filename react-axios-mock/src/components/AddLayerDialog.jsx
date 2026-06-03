import { useState } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Select, MenuItem, FormControl, InputLabel, Slider, Box, Typography,
} from '@mui/material'

export default function AddLayerDialog({ open, onClose, onAdd }) {
  const [name, setName] = useState('')
  const [type, setType] = useState('wms')
  const [url, setUrl] = useState('')
  const [layerName, setLayerName] = useState('')
  const [format, setFormat] = useState('image/png')
  const [opacity, setOpacity] = useState(1.0)
  const [maxLevel, setMaxLevel] = useState(18)

  const handleSubmit = () => {
    if (!name || !url) return
    const layerConfig = { name, type, url, opacity, maxLevel }
    if (type === 'wms') {
      layerConfig.layers = layerName
      layerConfig.format = format
      layerConfig.transparent = true
    }
    if (type === 'wmts') {
      layerConfig.layer = layerName
      layerConfig.style = 'default'
      layerConfig.format = format
      layerConfig.tileMatrixSetID = 'w'
    }
    onAdd(layerConfig)
    handleClose()
  }

  const handleClose = () => {
    setName('')
    setType('wms')
    setUrl('')
    setLayerName('')
    setFormat('image/png')
    setOpacity(1.0)
    setMaxLevel(18)
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>添加图层</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField label="图层名称" value={name} onChange={(e) => setName(e.target.value)} size="small" />
          <FormControl size="small" fullWidth>
            <InputLabel>图层类型</InputLabel>
            <Select value={type} label="图层类型" onChange={(e) => setType(e.target.value)}>
              <MenuItem value="wms">WMS</MenuItem>
              <MenuItem value="wmts">WMTS</MenuItem>
              <MenuItem value="xyz">在线地图 (XYZ)</MenuItem>
            </Select>
          </FormControl>
          <TextField label="URL" value={url} onChange={(e) => setUrl(e.target.value)} size="small" placeholder={type === 'wms' ? 'https://example.com/wms' : type === 'wmts' ? '/tianditu/vec_w/wmts' : 'https://tile.example.com/{z}/{x}/{y}.png'} />
          <TextField label={type === 'wms' ? '图层名 (Layers)' : type === 'wmts' ? '图层 (Layer)' : '图层标识'} value={layerName} onChange={(e) => setLayerName(e.target.value)} size="small" />
          {(type === 'wms' || type === 'wmts') && (
            <TextField label="格式 (Format)" value={format} onChange={(e) => setFormat(e.target.value)} size="small" />
          )}
          <Box>
            <Typography variant="caption">透明度: {Math.round(opacity * 100)}%</Typography>
            <Slider value={opacity} onChange={(_, v) => setOpacity(v)} min={0} max={1} step={0.1} size="small" />
          </Box>
          <TextField label="最大层级" type="number" value={maxLevel} onChange={(e) => setMaxLevel(Number(e.target.value))} size="small" inputProps={{ min: 1, max: 22 }} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>取消</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!name || !url}>添加</Button>
      </DialogActions>
    </Dialog>
  )
}
