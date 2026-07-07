import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material/styles'
import {
  Box, Paper, Typography, IconButton, TextField, Button,
  List, ListItem, ListItemButton, ListItemText, ListItemIcon,
  Checkbox, Divider, Slider, InputAdornment, Chip, Collapse
} from '@mui/material'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CircleIcon from '@mui/icons-material/Circle'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import ClearAllIcon from '@mui/icons-material/ClearAll'
import TouchAppIcon from '@mui/icons-material/TouchApp'

export default function CircleControl({
  circles,
  selectedCircleId,
  drawingMode,
  onAddCircle,
  onUpdateCircle,
  onDeleteCircle,
  onClearAll,
  onSetDrawingMode,
  onSelectCircle,
  onToggleVisibility,
  onClose
}) {
  const { t } = useTranslation()
  const theme = useTheme()
  const [expanded, setExpanded] = useState(true)
  const [newCircle, setNewCircle] = useState({
    name: '',
    center: { lng: 116.4, lat: 39.9 },
    radius: 1000,
    color: '#2196f3',
    opacity: 0.5,
    visible: true
  })

  const handleAdd = () => {
    if (newCircle.name.trim()) {
      onAddCircle(newCircle)
      setNewCircle({
        name: '',
        center: { lng: 116.4, lat: 39.9 },
        radius: 1000,
        color: '#2196f3',
        opacity: 0.5,
        visible: true
      })
    }
  }

  return (
    <Paper
      sx={{
        position: 'absolute',
        top: 16,
        right: 340,
        zIndex: 1000,
        minWidth: 280,
        maxWidth: 340,
        maxHeight: '80vh',
        overflow: 'auto',
        bgcolor: theme.palette.background.paper,
        backdropFilter: 'blur(10px)',
      }}
    >
      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, cursor: 'pointer', position: 'sticky', top: 0, bgcolor: 'inherit', zIndex: 1 }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <CircleIcon fontSize="small" sx={{ color: '#2196f3' }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{t('circle.title')}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={(e) => { e.stopPropagation(); onClose?.() }}
          >
            ×
          </IconButton>
          <IconButton size="small">
            {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ px: 1.5, pb: 1.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 1.5,
              p: 1,
              borderRadius: 1,
              bgcolor: drawingMode ? 'primary.main' : 'background.default',
              border: 1,
              borderColor: drawingMode ? 'primary.main' : 'divider',
              cursor: 'pointer'
            }}
            onClick={() => onSetDrawingMode(!drawingMode)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TouchAppIcon
                fontSize="small"
                sx={{ color: drawingMode ? 'primary.contrastText' : 'text.secondary' }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 'bold',
                  color: drawingMode ? 'primary.contrastText' : 'text.secondary'
                }}
              >
                {t('circle.drawingMode')}
              </Typography>
            </Box>
            <Chip
              label={drawingMode ? 'ON' : 'OFF'}
              size="small"
              color={drawingMode ? 'success' : 'default'}
              variant={drawingMode ? 'filled' : 'outlined'}
            />
          </Box>

          {drawingMode && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontStyle: 'italic' }}>
              {t('circle.drawingHint')}
            </Typography>
          )}

          <Divider sx={{ my: 1 }} />

          <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 1 }}>
            {t('circle.add')}
          </Typography>

          <TextField
            fullWidth
            size="small"
            label={t('circle.name')}
            value={newCircle.name}
            onChange={(e) => setNewCircle({ ...newCircle, name: e.target.value })}
            sx={{ mb: 1 }}
          />

          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <TextField
              fullWidth
              size="small"
              label={t('circle.longitude')}
              type="number"
              value={newCircle.center.lng}
              onChange={(e) => setNewCircle({ ...newCircle, center: { ...newCircle.center, lng: parseFloat(e.target.value) || 0 } })}
            />
            <TextField
              fullWidth
              size="small"
              label={t('circle.latitude')}
              type="number"
              value={newCircle.center.lat}
              onChange={(e) => setNewCircle({ ...newCircle, center: { ...newCircle.center, lat: parseFloat(e.target.value) || 0 } })}
            />
          </Box>

          <TextField
            fullWidth
            size="small"
            label={t('circle.radius')}
            type="number"
            value={newCircle.radius}
            onChange={(e) => setNewCircle({ ...newCircle, radius: parseFloat(e.target.value) || 0 })}
            InputProps={{
              endAdornment: <InputAdornment position="end">{t('circle.meters')}</InputAdornment>
            }}
            sx={{ mb: 1 }}
          />

          <TextField
            fullWidth
            size="small"
            label={t('circle.color')}
            type="color"
            value={newCircle.color}
            onChange={(e) => setNewCircle({ ...newCircle, color: e.target.value })}
            sx={{ mb: 1 }}
          />

          <Box sx={{ mb: 1.5 }}>
            <Typography variant="caption" color="text.secondary">{t('circle.opacity')}</Typography>
            <Slider
              value={newCircle.opacity}
              onChange={(_, v) => setNewCircle({ ...newCircle, opacity: v })}
              min={0}
              max={1}
              step={0.1}
              size="small"
            />
          </Box>

          <Button
            fullWidth
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            disabled={!newCircle.name.trim()}
            sx={{ mb: 1.5 }}
          >
            {t('circle.add')}
          </Button>

          <Divider sx={{ my: 1 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
              {t('circle.list')} ({circles.length})
            </Typography>
            {circles.length > 0 && (
              <IconButton size="small" onClick={onClearAll} color="error">
                <ClearAllIcon fontSize="small" />
              </IconButton>
            )}
          </Box>

          {circles.length === 0 ? (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', py: 2 }}>
              {t('circle.noCircles')}
            </Typography>
          ) : (
            <List dense disablePadding sx={{ maxHeight: 200, overflow: 'auto' }}>
              {circles.map((circle) => (
                <ListItem
                  key={circle.id}
                  disablePadding
                  secondaryAction={
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => onDeleteCircle(circle.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Checkbox
                      edge="start"
                      checked={circle.visible}
                      onChange={() => onToggleVisibility(circle.id)}
                      size="small"
                    />
                  </ListItemIcon>
                  <ListItemButton
                    selected={selectedCircleId === circle.id}
                    onClick={() => onSelectCircle(circle.id)}
                    dense
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CircleIcon
                            sx={{
                              fontSize: 12,
                              color: circle.color
                            }}
                          />
                          <Typography variant="body2" noWrap>{circle.name}</Typography>
                        </Box>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {circle.radius}m
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Collapse>
    </Paper>
  )
}
