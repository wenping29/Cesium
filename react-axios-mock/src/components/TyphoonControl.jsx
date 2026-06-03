import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box, Paper, Typography, List, ListItem, ListItemText, ListItemIcon,
  Collapse, IconButton, Chip, Divider,
} from '@mui/material'
import CycloneIcon from '@mui/icons-material/Cyclone'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import CloseIcon from '@mui/icons-material/Close'

function formatTime(timeStr) {
  const d = new Date(timeStr)
  return d.toLocaleString()
}

export default function TyphoonControl({
  current,
  historical,
  onClose,
  onTyphoonClick,
}) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(true)
  const [showHistorical, setShowHistorical] = useState(false)

  return (
    <Paper
      sx={{
        position: 'absolute',
        top: 80,
        right: 16,
        zIndex: 1000,
        width: 300,
        maxHeight: 'calc(100% - 100px)',
        bgcolor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <CycloneIcon fontSize="small" color="primary" />
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            {t('typhoon.title')}
          </Typography>
          <Chip label={current?.name || '-'} size="small" color="primary" variant="outlined" />
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
          {current && (
            <Box sx={{ p: 1.5, bgcolor: 'grey.50' }}>
              <Typography variant="caption" sx={{ fontWeight: 'bold' }}>{t('typhoon.current')}</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                <Chip label={`${t('typhoon.strength')}: ${current.strength}`} size="small" variant="outlined" />
                <Chip label={`${t('typhoon.windSpeed')}: ${current.windSpeed}m/s`} size="small" variant="outlined" />
                <Chip label={`${t('typhoon.pressure')}: ${current.pressure}hPa`} size="small" variant="outlined" />
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                {formatTime(current.time)}
              </Typography>
            </Box>
          )}

          <Divider />

          <ListItemButton sx={{ bgcolor: 'grey.100' }} onClick={() => setShowHistorical(!showHistorical)}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <CycloneIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={t('typhoon.historical')}
              secondary={`${historical.length} ${t('typhoon.records')}`}
            />
            {showHistorical ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
          </ListItemButton>

          <Collapse in={showHistorical}>
            <List dense disablePadding>
              {historical.map((ty) => (
                <ListItem
                  key={ty.id}
                  disablePadding
                  sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                  onClick={() => onTyphoonClick?.(ty)}
                >
                  <ListItemIcon sx={{ minWidth: 36, justifyContent: 'center' }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: ty.strength.includes('超强') || ty.strength.includes('super') ? '#f44336' : '#ff9800',
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={ty.name}
                    secondary={`${ty.strength} | ${ty.windSpeed}m/s | ${formatTime(ty.time)}`}
                    primaryTypographyProps={{ noWrap: true }}
                  />
                </ListItem>
              ))}
            </List>
          </Collapse>
        </Box>
      </Collapse>
    </Paper>
  )
}

function ListItemButton({ children, onClick, sx }) {
  return (
    <Box
      onClick={onClick}
      sx={{ display: 'flex', alignItems: 'center', px: 1.5, py: 1, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' }, ...sx }}
    >
      {children}
    </Box>
  )
}
