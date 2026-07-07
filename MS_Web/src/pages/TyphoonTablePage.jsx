import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Chip, CircularProgress, TablePagination,
} from '@mui/material'
import { getCurrentTyphoon, getHistoricalTyphoons } from '../api/typhoon'

export default function TyphoonTablePage() {
  const { t } = useTranslation()
  const [data, setData] = useState({ current: null, historical: [] })
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [curRes, histRes] = await Promise.all([
          getCurrentTyphoon(),
          getHistoricalTyphoons(),
        ])
        setData({ current: curRes.data, historical: histRes.data || [] })
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

  const allTyphoons = data.current
    ? [{ ...data.current, isCurrent: true }, ...data.historical.map((h) => ({ ...h, isCurrent: false }))]
    : data.historical.map((h) => ({ ...h, isCurrent: false }))

  const paged = allTyphoons.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        {t('typhoonTable.title')}
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('typhoonTable.name')}</TableCell>
              <TableCell>{t('typhoonTable.strength')}</TableCell>
              <TableCell>{t('typhoonTable.windSpeed')}</TableCell>
              <TableCell>{t('typhoonTable.pressure')}</TableCell>
              <TableCell>{t('typhoonTable.time')}</TableCell>
              <TableCell>{t('typhoonTable.status')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paged.map((ty) => (
              <TableRow key={ty.id} hover>
                <TableCell sx={{ fontWeight: 'medium' }}>{ty.name}</TableCell>
                <TableCell>{ty.strength}</TableCell>
                <TableCell>{ty.windSpeed} m/s</TableCell>
                <TableCell>{ty.pressure} hPa</TableCell>
                <TableCell>{new Date(ty.time).toLocaleString()}</TableCell>
                <TableCell>
                  <Chip
                    label={ty.isCurrent ? t('typhoonTable.active') : t('typhoonTable.historical')}
                    size="small"
                    color={ty.isCurrent ? 'error' : 'default'}
                    variant={ty.isCurrent ? 'filled' : 'outlined'}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={allTyphoons.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0) }}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </TableContainer>
    </Box>
  )
}
