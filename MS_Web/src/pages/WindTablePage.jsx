import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Chip, CircularProgress,
} from '@mui/material'
import { getWindData } from '../api/wind'

function getWindDirectionLabel(degrees) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const idx = Math.round(degrees / 45) % 8
  return dirs[idx]
}

export default function WindTablePage() {
  const { t } = useTranslation()
  const [windData, setWindData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getWindData()
        setWindData(res.data || [])
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
        {t('windTable.title')}
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ height: 48, py: 0 }}>{t('windTable.region')}</TableCell>
              <TableCell sx={{ height: 48, py: 0 }}>{t('windTable.direction')}</TableCell>
              <TableCell sx={{ height: 48, py: 0 }}>{t('windTable.speed')}</TableCell>
              <TableCell sx={{ height: 48, py: 0 }}>{t('windTable.gust')}</TableCell>
              <TableCell sx={{ height: 48, py: 0 }}>{t('windTable.location')}</TableCell>
              <TableCell sx={{ height: 48, py: 0 }}>{t('windTable.time')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {windData.map((w) => (
              <TableRow key={w.id} hover sx={{ height: 48 }}>
                <TableCell sx={{ height: 48, py: 0, fontWeight: 'medium' }}>{w.region}</TableCell>
                <TableCell sx={{ height: 48, py: 0 }}>
                  <Chip
                    label={`${w.direction}° ${getWindDirectionLabel(w.direction)}`}
                    size="small"
                    color="info"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell sx={{ height: 48, py: 0 }}>{w.speed} m/s</TableCell>
                <TableCell sx={{ height: 48, py: 0 }}>{w.gust} m/s</TableCell>
                <TableCell sx={{ height: 48, py: 0 }}>({w.lat}, {w.lng})</TableCell>
                <TableCell sx={{ height: 48, py: 0 }}>{w.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
