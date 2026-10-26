import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material/styles'
import { Box, Paper, Typography, Switch, FormControlLabel, Card, CardContent } from '@mui/material'
import TiandituMap from '../../components/Map/TiandituMap'
import { TIANDITU_BASEMAPS } from '../../components/Map/tiandituBasemaps'

const BASEMAP_KEYS = Object.keys(TIANDITU_BASEMAPS)

export default function TiandituMapPage() {
  const { t } = useTranslation()
  const theme = useTheme()
  const [basemap, setBasemap] = useState('vec')
  const [annotationVisible, setAnnotationVisible] = useState(true)

  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
      <TiandituMap basemap={basemap} annotationVisible={annotationVisible} />

      <Typography
        variant="h6"
        sx={{
          position: 'absolute', top: 16, left: 16, zIndex: 10,
          color: 'white', bgcolor: 'rgba(0,0,0,0.5)', px: 2, py: 0.5, borderRadius: 1,
        }}
      >
        {t('map.tiandituTitle')}
      </Typography>

      <Paper
        sx={{
          position: 'absolute', top: 16, right: 16, zIndex: 10, width: 220, p: 1.5,
          bgcolor: theme.palette.background.paper, backdropFilter: 'blur(10px)',
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 1 }}>
          {t('tianditu.basemap')}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {BASEMAP_KEYS.map((key) => {
            const selected = key === basemap
            return (
              <Card
                key={key}
                variant="outlined"
                onClick={() => setBasemap(key)}
                sx={{
                  cursor: 'pointer',
                  borderColor: selected ? 'primary.main' : 'divider',
                  borderWidth: selected ? 2 : 1,
                  bgcolor: selected ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                  transition: 'border-color .15s, background-color .15s',
                  '&:hover': { borderColor: 'primary.light' },
                }}
              >
                <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                  <Typography variant="body2" sx={{ fontWeight: selected ? 'bold' : 400 }}>
                    {t(`tianditu.${key}`)}
                  </Typography>
                </CardContent>
              </Card>
            )
          })}
        </Box>

        <FormControlLabel
          sx={{ mt: 1 }}
          control={
            <Switch
              size="small"
              checked={annotationVisible}
              onChange={(e) => setAnnotationVisible(e.target.checked)}
            />
          }
          label={<Typography variant="body2">{t('tianditu.annotation')}</Typography>}
        />

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          {t('tianditu.hint')}
        </Typography>
      </Paper>
    </Box>
  )
}
