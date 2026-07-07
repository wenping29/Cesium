import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box, Paper, Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, CircularProgress, Alert, TablePagination, Button, TextField, Stack,
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

  const [filters, setFilters] = useState({ username: '', startDate: '', endDate: '' })
  const [searchParams, setSearchParams] = useState({})

  const buildParams = (pageNum, size, params) => {
    const result = { page: pageNum + 1, pageSize: size }
    if (params.username) result.username = params.username
    if (params.startDate) result.startDate = new Date(params.startDate).toISOString()
    if (params.endDate) result.endDate = new Date(params.endDate + 'T23:59:59').toISOString()
    return result
  }

  useEffect(() => {
    let cancelled = false
    const fetchLogs = async () => {
      setLoading(true)
      setError(null)
      try {
        const params = buildParams(page, pageSize, searchParams)
        const res = await getLoginLogs(params)
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
  }, [page, pageSize, searchParams])

  const handleSearch = () => {
    setSearchParams({ ...filters })
    setPage(0)
  }

  const handleReset = () => {
    setFilters({ username: '', startDate: '', endDate: '' })
    setSearchParams({})
    setPage(0)
  }

  const handleChangePage = (event, newPage) => setPage(newPage)
  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10))
    setPage(0)
  }

  return (
    <Box sx={{ p: 2 }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <TextField
            sx={{ minWidth: 180 }} size="small" label={t('loginLogReport.username')}
            value={filters.username}
            onChange={(e) => setFilters({ ...filters, username: e.target.value })}
          />
          <TextField
            sx={{ minWidth: 180 }} size="small" label={t('auditLogReport.startDate')}
            type="date" slotProps={{ inputLabel: { shrink: true } }}
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          />
          <TextField
            sx={{ minWidth: 180 }} size="small" label={t('auditLogReport.endDate')}
            type="date" slotProps={{ inputLabel: { shrink: true } }}
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          />
          <Stack direction="row" spacing={1}>
            <Button variant="contained" onClick={handleSearch}>
              {t('common.search')}
            </Button>
            <Button variant="outlined" onClick={handleReset}>
              {t('common.reset')}
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper>
          <TableContainer sx={{ height: 600 }}>
            <Table size="small" stickyHeader>
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
                  <TableRow sx={{ height: 48 }}>
                    <TableCell colSpan={7} align="center" sx={{ height: 48, py: 0 }}>
                      {t('common.noData')}
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id} hover sx={{ height: 48 }}>
                      <TableCell sx={{ height: 48, py: 0 }}>{log.id}</TableCell>
                      <TableCell sx={{ height: 48, py: 0 }}>{log.username}</TableCell>
                      <TableCell sx={{ height: 48, py: 0 }}>{log.ipAddress || '-'}</TableCell>
                      <TableCell sx={{ height: 48, py: 0 }}>{log.deviceInfo || '-'}</TableCell>
                      <TableCell sx={{ height: 48, py: 0 }}>{log.browserInfo || '-'}</TableCell>
                      <TableCell sx={{ height: 48, py: 0 }}>{log.osInfo || '-'}</TableCell>
                      <TableCell sx={{ height: 48, py: 0 }}>{new Date(log.loginTime).toLocaleString()}</TableCell>
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
