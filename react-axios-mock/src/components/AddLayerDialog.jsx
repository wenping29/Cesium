import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Select, MenuItem, FormControl, InputLabel, Slider, Box, Typography,
} from '@mui/material'

export default function AddLayerDialog({ open, onClose, onAdd }) {
  const { t } = useTranslation()
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
      <DialogTitle>{t('layer.addTitle')}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField label={t('layer.addName')} value={name} onChange={(e) => setName(e.target.value)} size="small" />
          <FormControl size="small" fullWidth>
            <InputLabel>{t('layer.addType')}</InputLabel>
            <Select value={type} label={t('layer.addType')} onChange={(e) => setType(e.target.value)}>
              <MenuItem value="wms">{t('layer.typeWms')}</MenuItem>
              <MenuItem value="wmts">{t('layer.typeWmts')}</MenuItem>
              <MenuItem value="xyz">{t('layer.typeXyz')} (XYZ)</MenuItem>
            </Select>
          </FormControl>
          <TextField label={t('layer.addUrl')} value={url} onChange={(e) => setUrl(e.target.value)} size="small" placeholder={type === 'wms' ? 'https://example.com/wms' : type === 'wmts' ? '/tianditu/vec_w/wmts' : 'https://tile.example.com/{z}/{x}/{y}.png'} />
          <TextField label={`${t('layer.addLayer')}${type === 'wms' ? ' (Layers)' : ''}`} value={layerName} onChange={(e) => setLayerName(e.target.value)} size="small" />
          {(type === 'wms' || type === 'wmts') && (
            <TextField label={t('layer.addFormat')} value={format} onChange={(e) => setFormat(e.target.value)} size="small" />
          )}
          <Box>
            <Typography variant="caption">{t('layer.opacity')}: {Math.round(opacity * 100)}%</Typography>
            <Slider value={opacity} onChange={(_, v) => setOpacity(v)} min={0} max={1} step={0.1} size="small" />
          </Box>
          <TextField label={t('layer.addMaxLevel')} type="number" value={maxLevel} onChange={(e) => setMaxLevel(Number(e.target.value))} size="small" inputProps={{ min: 1, max: 22 }} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t('layer.cancel')}</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!name || !url}>{t('layer.confirm')}</Button>
      </DialogActions>
    </Dialog>
  )
}
