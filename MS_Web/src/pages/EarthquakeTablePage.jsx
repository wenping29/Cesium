import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Chip, CircularProgress, TablePagination,
} from '@mui/material'
import { getEarthquakes } from '../api/earthquake'

function getMagnitudeColor(mag) {
  if (mag < 3) return '#4caf50'
  if (mag < 5) return '#ff9800'
  if (mag < 7) return '#f44336'
  return '#9c27b0'
}

export default function EarthquakeTablePage() {
  const { t } = useTranslation()
  const [earthquakes, setEarthquakes] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(15)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getEarthquakes()
        setEarthquakes(res.data || [])
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

  const paged = earthquakes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        {t('earthquakeTable.title')}
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ height: 48, py: 0 }}>{t('earthquakeTable.magnitude')}</TableCell>
              <TableCell sx={{ height: 48, py: 0 }}>{t('earthquakeTable.depth')}</TableCell>
              <TableCell sx={{ height: 48, py: 0 }}>{t('earthquakeTable.region')}</TableCell>
              <TableCell sx={{ height: 48, py: 0 }}>{t('earthquakeTable.time')}</TableCell>
              <TableCell sx={{ height: 48, py: 0 }}>{t('earthquakeTable.location')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paged.map((eq) => (
              <TableRow key={eq.id} hover sx={{ height: 48 }}>
                <TableCell sx={{ height: 48, py: 0 }}>
                  <Chip
                    label={`M${eq.magnitude.toFixed(1)}`}
                    size="small"
                    sx={{ color: '#fff', bgcolor: getMagnitudeColor(eq.magnitude), fontWeight: 'bold' }}
                  />
                </TableCell>
                <TableCell sx={{ height: 48, py: 0 }}>{eq.depth} km</TableCell>
                <TableCell sx={{ height: 48, py: 0 }}>{eq.region}</TableCell>
                <TableCell sx={{ height: 48, py: 0 }}>{new Date(eq.time).toLocaleString()}</TableCell>
                <TableCell sx={{ height: 48, py: 0 }}>({eq.lat}, {eq.lng})</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={earthquakes.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0) }}
          rowsPerPageOptions={[10, 15, 25, 50]}
        />
      </TableContainer>
    </Box>
  )
}
