import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box, Paper, Typography, List, ListItem, ListItemText, ListItemIcon,
  Collapse, IconButton, Chip, Divider,
} from '@mui/material'
import AirIcon from '@mui/icons-material/Air'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import CloseIcon from '@mui/icons-material/Close'

function getAqiColor(aqi) {
  if (aqi <= 50) return '#4caf50'
  if (aqi <= 100) return '#ffeb3b'
  if (aqi <= 150) return '#ff9800'
  if (aqi <= 200) return '#f44336'
  if (aqi <= 300) return '#9c27b0'
  return '#795548'
}

export default function AirQualityControl({
  stations,
  onClose,
  onStationClick,
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
          <AirIcon fontSize="small" color="success" />
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            {t('airQuality.title')}
          </Typography>
          <Chip label={stations.length} size="small" color="success" variant="outlined" />
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
            {stations.map((s) => (
              <ListItem
                key={s.id}
                disablePadding
                sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                onClick={() => onStationClick?.(s)}
              >
                <ListItemIcon sx={{ minWidth: 36, justifyContent: 'center' }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: getAqiColor(s.aqi),
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {s.station}
                      </Typography>
                      <Chip
                        label={`AQI ${s.aqi}`}
                        size="small"
                        sx={{ height: 16, fontSize: 9, color: '#fff', bgcolor: getAqiColor(s.aqi) }}
                      />
                    </Box>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {t('airQuality.level')}: {s.level} | PM2.5: {s.pm25} | {s.time}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Collapse>
    </Paper>
  )
}
