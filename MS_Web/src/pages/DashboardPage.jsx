import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box, Typography, Paper, Grid, Card, CardContent, Chip, CircularProgress,
} from '@mui/material'
import VolcanoIcon from '@mui/icons-material/Volcano'
import AirIcon from '@mui/icons-material/Air'
import StormIcon from '@mui/icons-material/Storm'
import WavesIcon from '@mui/icons-material/Waves'
import { getEarthquakes } from '../api/earthquake'
import { getAirQuality } from '../api/airquality'
import { getCurrentTyphoon, getHistoricalTyphoons } from '../api/typhoon'
import { getWindData } from '../api/wind'

export default function DashboardPage() {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    earthquakes: 0,
    airQualityStations: 0,
    typhoonRecords: 0,
    windRegions: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eqRes, aqRes, tyCurRes, tyHistRes, wdRes] = await Promise.all([
          getEarthquakes(),
          getAirQuality(),
          getCurrentTyphoon(),
          getHistoricalTyphoons(),
          getWindData(),
        ])
        setStats({
          earthquakes: eqRes.data?.length || 0,
          airQualityStations: aqRes.data?.length || 0,
          typhoonRecords: (tyCurRes.data ? 1 : 0) + (tyHistRes.data?.length || 0),
          windRegions: wdRes.data?.length || 0,
        })
      } catch {
        // silent
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const cards = [
    {
      key: 'earthquakes',
      icon: <VolcanoIcon sx={{ fontSize: 40, color: '#f44336' }} />,
      label: t('dashboard.earthquakes'),
      value: stats.earthquakes,
      color: '#f44336',
    },
    {
      key: 'airQuality',
      icon: <AirIcon sx={{ fontSize: 40, color: '#4caf50' }} />,
      label: t('dashboard.airQuality'),
      value: stats.airQualityStations,
      color: '#4caf50',
    },
    {
      key: 'typhoon',
      icon: <StormIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
      label: t('dashboard.typhoon'),
      value: stats.typhoonRecords,
      color: '#1976d2',
    },
    {
      key: 'wind',
      icon: <WavesIcon sx={{ fontSize: 40, color: '#00acc1' }} />,
      label: t('dashboard.wind'),
      value: stats.windRegions,
      color: '#00acc1',
    },
  ]

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        {t('dashboard.title')}
      </Typography>
      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.key}>
            <Card sx={{ position: 'relative', overflow: 'visible' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">{card.label}</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
                      {card.value}
                    </Typography>
                  </Box>
                  {card.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
