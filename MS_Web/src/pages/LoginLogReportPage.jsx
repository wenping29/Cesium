import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box, Typography, Paper, Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, CircularProgress, Alert, TablePagination,
} from '@mui/material'
import { getLoginLogs } from '../api/loginLogs'

export default function LoginLogReportPage() {
  const { t } = useTranslation()
  const [logs, setLogs] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(20)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    const fetchLogs = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await getLoginLogs({ page: page + 1, pageSize })
        if (!cancelled) {
          setLogs(res.data || [])
          setTotal(res.total || 0)
        }
      } catch (err) {
        if (!cancelled) setError(err?.response?.data || err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchLogs()
    return () => { cancelled = true }
  }, [page, pageSize])

  const handleChangePage = (event, newPage) => setPage(newPage)
  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10))
    setPage(0)
  }

  return (
    <Box sx={{ p: 2 }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth size="small" label={t('loginLogReport.username')}
              value={filters.username}
              onChange={(e) => setFilters({ ...filters, username: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth size="small" label={t('auditLogReport.startDate')}
              type="date" InputLabelProps={{ shrink: true }}
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth size="small" label={t('auditLogReport.endDate')}
              type="date" InputLabelProps={{ shrink: true }}
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="contained" onClick={handleSearch}>
                {t('common.search')}
              </Button>
              <Button variant="outlined" onClick={handleReset}>
                {t('common.reset')}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('loginLogReport.id')}</TableCell>
                  <TableCell>{t('loginLogReport.username')}</TableCell>
                  <TableCell>{t('loginLogReport.ipAddress')}</TableCell>
                  <TableCell>{t('loginLogReport.deviceInfo')}</TableCell>
                  <TableCell>{t('loginLogReport.browserInfo')}</TableCell>
                  <TableCell>{t('loginLogReport.osInfo')}</TableCell>
                  <TableCell>{t('loginLogReport.loginTime')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      {t('common.noData')}
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id} hover>
                      <TableCell>{log.id}</TableCell>
                      <TableCell>{log.username}</TableCell>
                      <TableCell>{log.ipAddress || '-'}</TableCell>
                      <TableCell>{log.deviceInfo || '-'}</TableCell>
                      <TableCell>{log.browserInfo || '-'}</TableCell>
                      <TableCell>{log.osInfo || '-'}</TableCell>
                      <TableCell>{new Date(log.loginTime).toLocaleString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={pageSize}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 20, 50, 100]}
          />
        </Paper>
      )}
    </Box>
  )
}
