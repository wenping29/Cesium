import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box, FormControl, InputLabel, Select, MenuItem, Paper, Typography,
  Checkbox, FormControlLabel, Collapse, Slider, List, ListItem,
  ListItemIcon, ListItemText, IconButton, Chip, Divider,
} from '@mui/material'
import LayersIcon from '@mui/icons-material/Layers'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import VolcanoIcon from '@mui/icons-material/Volcano'
import AirIcon from '@mui/icons-material/Air'
import StormIcon from '@mui/icons-material/Storm'
import WavesIcon from '@mui/icons-material/Waves'
import AddLayerDialog from './AddLayerDialog'

const BASEMAP_OPTIONS = [
  { id: 'tianditu_vec', name: '天地图矢量', type: 'tianditu', layer: 'vec', annotation: 'cva' },
  { id: 'tianditu_img', name: '天地图卫星', type: 'tianditu', layer: 'img', annotation: 'cia' },
  { id: 'tianditu_ter', name: '天地图地形', type: 'tianditu', layer: 'ter', annotation: 'cta' },
  { id: 'amap_vec', name: '高德街道图', type: 'amap', layer: 'vec' },
  { id: 'amap_img', name: '高德卫星图', type: 'amap', layer: 'img' },
  { id: 'baidu_traffic', name: '百度交通图', type: 'baidu', layer: 'traffic' },
]

export default function LayerControl({
  currentBasemap,
  onBasemapChange,
  customLayers = [],
  onToggleLayer,
  onRemoveLayer,
  onAddLayer,
  hexGridVisible,
  onToggleHexGrid,
  hexGridOpacity,
  onHexGridOpacity,
  hexGridCellSizeKm,
  onHexGridCellSizeKm,
  earthquakeVisible,
  onToggleEarthquake,
  airQualityVisible,
  onToggleAirQuality,
  typhoonVisible,
  onToggleTyphoon,
  windVisible,
  onToggleWind,
}) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)

  const thematicModules = [
    { key: 'earthquake', label: t('earthquake.title'), visible: earthquakeVisible, onToggle: onToggleEarthquake, icon: <VolcanoIcon fontSize="small" sx={{ color: '#f44336' }} /> },
    { key: 'airQuality', label: t('airQuality.title'), visible: airQualityVisible, onToggle: onToggleAirQuality, icon: <AirIcon fontSize="small" sx={{ color: '#4caf50' }} /> },
    { key: 'typhoon', label: t('typhoon.title'), visible: typhoonVisible, onToggle: onToggleTyphoon, icon: <StormIcon fontSize="small" sx={{ color: '#1976d2' }} /> },
    { key: 'wind', label: t('wind.title'), visible: windVisible, onToggle: onToggleWind, icon: <WavesIcon fontSize="small" sx={{ color: '#00acc1' }} /> },
  ]

  return (
    <Paper
      sx={{
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 1000,
        minWidth: 260,
        maxWidth: 320,
        bgcolor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, cursor: 'pointer' }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <LayersIcon fontSize="small" />
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{t('layer.title')}</Typography>
        </Box>
        <IconButton size="small">
          {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ px: 1.5, pb: 1.5 }}>
          <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
            <InputLabel>{t('layer.basemap')}</InputLabel>
            <Select value={currentBasemap} label={t('layer.basemap')} onChange={(e) => onBasemapChange(e.target.value)}>
              {BASEMAP_OPTIONS.map((opt) => (
                <MenuItem key={opt.id} value={opt.id}>{opt.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Divider sx={{ my: 1 }} />

          <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 0.5 }}>
            {t('layer.overlay')}
          </Typography>

          <FormControlLabel
            control={
              <Checkbox
                checked={hexGridVisible}
                onChange={onToggleHexGrid}
                size="small"
                sx={{ color: '#4a90e2', '&.Mui-checked': { color: '#4a90e2' } }}
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2">{t('layer.hexGrid')}</Typography>
                <Chip label="Goldberg" size="small" color="primary" variant="outlined" sx={{ height: 18, fontSize: 10 }} />
              </Box>
            }
            sx={{ mb: 0.5 }}
          />
          {hexGridVisible && (
            <Box sx={{ pl: 4, pr: 1, mb: 1 }}>
              <Typography variant="caption" color="text.secondary">{t('layer.opacity')}</Typography>
              <Slider value={hexGridOpacity} onChange={(_, v) => onHexGridOpacity(v)} min={0} max={1} step={0.1} size="small" />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {t('layer.cellSize')}: {hexGridCellSizeKm}km
              </Typography>
              <Slider
                value={hexGridCellSizeKm}
                onChange={(_, v) => onHexGridCellSizeKm(v)}
                min={1}
                max={10}
                step={1}
                size="small"
                marks
              />
            </Box>
          )}

          <Divider sx={{ my: 1 }} />

          <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 0.5 }}>
            {t('layer.thematicModules')}
          </Typography>

          {thematicModules.map((mod) => (
            <FormControlLabel
              key={mod.key}
              control={
                <Checkbox
                  checked={mod.visible}
                  onChange={mod.onToggle}
                  size="small"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {mod.icon}
                  <Typography variant="body2">{mod.label}</Typography>
                </Box>
              }
              sx={{ mb: 0.2 }}
            />
          ))}

          <Divider sx={{ my: 1 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
              {t('layer.custom')} ({customLayers.length})
            </Typography>
            <IconButton size="small" onClick={() => setShowAddDialog(true)} color="primary">
              <AddCircleIcon fontSize="small" />
            </IconButton>
          </Box>

          {customLayers.length === 0 ? (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', py: 1 }}>
              {t('layer.customEmpty')}
            </Typography>
          ) : (
            <List dense disablePadding>
              {customLayers.map((layer) => (
                <ListItem key={layer.id} disablePadding sx={{ pl: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Checkbox edge="start" checked={layer.visible} onChange={() => onToggleLayer(layer.id)} size="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography variant="body2" noWrap>{layer.name}</Typography>}
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {layer.type === 'wms' ? t('layer.typeWms')
                          : layer.type === 'wmts' ? t('layer.typeWmts')
                          : layer.type === 'xyz' ? t('layer.typeXyz')
                          : layer.type}
                      </Typography>
                    }
                  />
                  <IconButton edge="end" size="small" onClick={() => onRemoveLayer(layer.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Collapse>

      <AddLayerDialog open={showAddDialog} onClose={() => setShowAddDialog(false)} onAdd={onAddLayer} />
    </Paper>
  )
}

export { BASEMAP_OPTIONS }
