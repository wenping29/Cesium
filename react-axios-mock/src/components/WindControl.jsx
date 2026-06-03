import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box, Paper, Typography, List, ListItem, ListItemText, ListItemIcon,
  Collapse, IconButton, Chip, Divider,
} from '@mui/material'
import WavesIcon from '@mui/icons-material/Waves'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import CloseIcon from '@mui/icons-material/Close'

function getWindDirectionLabel(degrees) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const idx = Math.round(degrees / 45) % 8
  return dirs[idx]
}

export default function WindControl({
  windData,
  onClose,
  onWindClick,
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
          <WavesIcon fontSize="small" color="info" />
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            {t('wind.title')}
          </Typography>
          <Chip label={windData.length} size="small" color="info" variant="outlined" />
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
            {windData.map((w) => (
              <ListItem
                key={w.id}
                disablePadding
                sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                onClick={() => onWindClick?.(w)}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {w.region}
                      </Typography>
                      <Chip
                        label={`${getWindDirectionLabel(w.direction)} ${w.speed}m/s`}
                        size="small"
                        color="info"
                        variant="outlined"
                        sx={{ height: 18, fontSize: 10 }}
                      />
                    </Box>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {t('wind.direction')}: {w.direction}° | {t('wind.gust')}: {w.gust}m/s | {w.time}
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
