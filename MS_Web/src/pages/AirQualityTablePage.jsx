import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Chip, CircularProgress,
} from '@mui/material'
import { getAirQuality } from '../api/airquality'

function getAqiColor(aqi) {
  if (aqi <= 50) return '#4caf50'
  if (aqi <= 100) return '#ffeb3b'
  if (aqi <= 150) return '#ff9800'
  if (aqi <= 200) return '#f44336'
  if (aqi <= 300) return '#9c27b0'
  return '#795548'
}

export default function AirQualityTablePage() {
  const { t } = useTranslation()
  const [stations, setStations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAirQuality()
        setStations(res.data || [])
      } catch {
        // silent
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

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
        {t('airQualityTable.title')}
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ height: 48, py: 0 }}>{t('airQualityTable.station')}</TableCell>
              <TableCell sx={{ height: 48, py: 0 }}>{t('airQualityTable.aqi')}</TableCell>
              <TableCell sx={{ height: 48, py: 0 }}>{t('airQualityTable.level')}</TableCell>
              <TableCell sx={{ height: 48, py: 0 }}>PM2.5</TableCell>
              <TableCell sx={{ height: 48, py: 0 }}>PM10</TableCell>
              <TableCell sx={{ height: 48, py: 0 }}>O₃</TableCell>
              <TableCell sx={{ height: 48, py: 0 }}>NO₂</TableCell>
              <TableCell sx={{ height: 48, py: 0 }}>{t('airQualityTable.time')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stations.map((s) => (
              <TableRow key={s.id} hover sx={{ height: 48 }}>
                <TableCell sx={{ height: 48, py: 0, fontWeight: 'medium' }}>{s.station}</TableCell>
                <TableCell sx={{ height: 48, py: 0 }}>
                  <Chip
                    label={s.aqi}
                    size="small"
                    sx={{ color: '#fff', bgcolor: getAqiColor(s.aqi), fontWeight: 'bold', minWidth: 40 }}
                  />
                </TableCell>
                <TableCell sx={{ height: 48, py: 0 }}>{s.level}</TableCell>
                <TableCell sx={{ height: 48, py: 0 }}>{s.pm25}</TableCell>
                <TableCell sx={{ height: 48, py: 0 }}>{s.pm10}</TableCell>
                <TableCell sx={{ height: 48, py: 0 }}>{s.o3}</TableCell>
                <TableCell sx={{ height: 48, py: 0 }}>{s.no2}</TableCell>
                <TableCell sx={{ height: 48, py: 0 }}>{s.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
