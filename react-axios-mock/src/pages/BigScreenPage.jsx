import { useEffect, useState, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Typography, Paper, CircularProgress, IconButton } from '@mui/material'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'
import { getEarthquakes } from '../api/earthquake'
import { getAirQuality } from '../api/airquality'
import { getCurrentTyphoon } from '../api/typhoon'
import { getWindData } from '../api/wind'

function useResize() {
  const ref = useRef(null)
  const [size, setSize] = useState({ width: 1920, height: 1080 })
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect
      setSize({ width, height })
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return [ref, size]
}

export default function BigScreenPage() {
  const { t } = useTranslation()
  const [containerRef, size] = useResize()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({ earthquakes: [], airQuality: [], typhoon: null, wind: [] })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const pageRef = useRef(null)

  const toggleFullscreen = useCallback(() => {
    const el = pageRef.current?.parentElement
    if (!el) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      el.requestFullscreen()
    }
  }, [])

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  const scale = Math.min(size.width / 1920, size.height / 1080)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [eqRes, aqRes, tyRes, wdRes] = await Promise.all([
          getEarthquakes(),
          getAirQuality(),
          getCurrentTyphoon(),
          getWindData(),
        ])
        setData({
          earthquakes: eqRes.data || [],
          airQuality: aqRes.data || [],
          typhoon: tyRes.data || null,
          wind: wdRes.data || [],
        })
      } catch {
        // silent
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    )
  }

  const strongEarthquakes = data.earthquakes.filter((eq) => eq.magnitude >= 5)
  const avgAqi = data.airQuality.length
    ? Math.round(data.airQuality.reduce((s, st) => s + st.aqi, 0) / data.airQuality.length)
    : 0
  const maxWind = data.wind.length
    ? Math.max(...data.wind.map((w) => w.speed))
    : 0

  return (
    <Box
      ref={(el) => { containerRef.current = el; pageRef.current = el }}
      sx={{
        width: '100%',
        height: '100%',
        bgcolor: '#0a1628',
        color: '#fff',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <IconButton
        onClick={toggleFullscreen}
        sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10, color: 'rgba(255,255,255,0.7)' }}
      >
        {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
      </IconButton>
      <Box
        sx={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: 1920,
          height: 1080,
          position: 'relative',
          p: 4,
        }}
      >
        {/* Header */}
        <Typography variant="h3" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 4, letterSpacing: 4 }}>
          {t('bigScreen.title')}
        </Typography>

        {/* Top row: stats */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
          <Paper sx={{ flex: 1, p: 3, bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Typography variant="h6" sx={{ color: '#f44336', mb: 1 }}>{t('bigScreen.earthquakeTotal')}</Typography>
            <Typography variant="h2" sx={{ fontWeight: 'bold' }}>{data.earthquakes.length}</Typography>
            <Typography variant="body2" sx={{ color: '#ff9800', mt: 1 }}>
              {t('bigScreen.strongEarthquakes')}: {strongEarthquakes.length}
            </Typography>
          </Paper>
          <Paper sx={{ flex: 1, p: 3, bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Typography variant="h6" sx={{ color: '#4caf50', mb: 1 }}>{t('bigScreen.avgAqi')}</Typography>
            <Typography variant="h2" sx={{ fontWeight: 'bold' }}>{avgAqi}</Typography>
            <Typography variant="body2" sx={{ color: '#81c784', mt: 1 }}>
              {data.airQuality.length} {t('bigScreen.stations')}
            </Typography>
          </Paper>
          <Paper sx={{ flex: 1, p: 3, bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Typography variant="h6" sx={{ color: '#42a5f5', mb: 1 }}>{t('bigScreen.typhoonCurrent')}</Typography>
            <Typography variant="h2" sx={{ fontWeight: 'bold' }}>{data.typhoon?.name || '-'}</Typography>
            <Typography variant="body2" sx={{ color: '#90caf9', mt: 1 }}>
              {data.typhoon ? `${data.typhoon.strength} | ${data.typhoon.windSpeed}m/s` : t('bigScreen.noData')}
            </Typography>
          </Paper>
          <Paper sx={{ flex: 1, p: 3, bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Typography variant="h6" sx={{ color: '#00acc1', mb: 1 }}>{t('bigScreen.maxWind')}</Typography>
            <Typography variant="h2" sx={{ fontWeight: 'bold' }}>{maxWind.toFixed(1)} m/s</Typography>
            <Typography variant="body2" sx={{ color: '#4dd0e1', mt: 1 }}>
              {data.wind.length} {t('bigScreen.regions')}
            </Typography>
          </Paper>
        </Box>

        {/* Bottom row: tables */}
        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Earthquake list */}
          <Paper sx={{ flex: 1, p: 2, bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', maxHeight: 500, overflow: 'auto' }}>
            <Typography variant="h6" sx={{ color: '#f44336', mb: 2 }}>{t('bigScreen.recentEarthquakes')}</Typography>
            {data.earthquakes.slice(0, 20).map((eq) => (
              <Box key={eq.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <Typography variant="body2">M{eq.magnitude.toFixed(1)} - {eq.region}</Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>{eq.depth}km</Typography>
              </Box>
            ))}
          </Paper>

          {/* Air quality list */}
          <Paper sx={{ flex: 1, p: 2, bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', maxHeight: 500, overflow: 'auto' }}>
            <Typography variant="h6" sx={{ color: '#4caf50', mb: 2 }}>{t('bigScreen.airQualityStations')}</Typography>
            {data.airQuality.map((s) => (
              <Box key={s.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <Typography variant="body2">{s.station}</Typography>
                <Typography variant="body2" sx={{ color: s.aqi <= 100 ? '#4caf50' : s.aqi <= 200 ? '#ff9800' : '#f44336' }}>
                  AQI {s.aqi}
                </Typography>
              </Box>
            ))}
          </Paper>

          {/* Wind list */}
          <Paper sx={{ flex: 1, p: 2, bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', maxHeight: 500, overflow: 'auto' }}>
            <Typography variant="h6" sx={{ color: '#00acc1', mb: 2 }}>{t('bigScreen.windRegions')}</Typography>
            {data.wind.map((w) => (
              <Box key={w.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <Typography variant="body2">{w.region}</Typography>
                <Typography variant="body2">{w.speed}m/s ↗{w.gust}m/s</Typography>
              </Box>
            ))}
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}
