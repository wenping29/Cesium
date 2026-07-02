import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box, Paper, Typography, List, ListItem, ListItemText, ListItemIcon,
  Collapse, IconButton, Chip, Divider,
} from '@mui/material'
import VolcanoIcon from '@mui/icons-material/Volcano'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import CloseIcon from '@mui/icons-material/Close'

function getMagnitudeColor(mag) {
  if (mag < 3) return '#4caf50'
  if (mag < 5) return '#ff9800'
  if (mag < 7) return '#f44336'
  return '#9c27b0'
}

function getMagnitudeLabel(mag) {
  if (mag < 3) return 'minor'
  if (mag < 5) return 'moderate'
  if (mag < 7) return 'strong'
  return 'major'
}

function formatTime(timeStr) {
  const d = new Date(timeStr)
  return d.toLocaleString()
}

export default function EarthquakeControl({
  earthquakes,
  onClose,
  onEarthquakeClick,
  sx = {},
}) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(true)

  return (
    <Paper
      sx={{
        width: 300,
        maxHeight: 'calc(100vh - 180px)',
        bgcolor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        ...sx,
      }}
    >
      <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <VolcanoIcon fontSize="small" color="error" />
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            {t('earthquake.title')}
          </Typography>
          <Chip label={earthquakes.length} size="small" color="error" variant="outlined" />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton size="small" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
          </IconButton>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Divider />

      <Collapse in={expanded}>
        <Box sx={{ overflow: 'auto', maxHeight: 'calc(100vh - 280px)' }}>
          <List dense disablePadding>
            {earthquakes.map((eq) => (
              <ListItem
                key={eq.id}
                disablePadding
                sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                onClick={() => onEarthquakeClick?.(eq)}
              >
                <ListItemIcon sx={{ minWidth: 36, justifyContent: 'center' }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: getMagnitudeColor(eq.magnitude),
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        M{eq.magnitude.toFixed(1)}
                      </Typography>
                      <Chip
                        label={t(`earthquake.${getMagnitudeLabel(eq.magnitude)}`)}
                        size="small"
                        sx={{ height: 16, fontSize: 9, color: '#fff', bgcolor: getMagnitudeColor(eq.magnitude) }}
                      />
                    </Box>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {eq.region} | {t('earthquake.depth')}: {eq.depth}km | {formatTime(eq.time)}
                    </Typography>
                  }
                  primaryTypographyProps={{ noWrap: true }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Collapse>
    </Paper>
  )
}
