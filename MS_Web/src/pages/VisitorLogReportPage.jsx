import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box, Paper, Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, CircularProgress, Alert, TablePagination, Button, TextField, Stack,
} from '@mui/material'
import { getVisitorLogs } from '../api/visitorLogs'

export default function VisitorLogReportPage() {
  const { t } = useTranslation()
  const [logs, setLogs] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(20)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [filters, setFilters] = useState({ ipAddress: '', pageUrl: '', startDate: '', endDate: '' })
  const [searchParams, setSearchParams] = useState({})

  const buildParams = (pageNum, size, params) => {
    const result = { page: pageNum + 1, pageSize: size }
    if (params.ipAddress) result.ipAddress = params.ipAddress
    if (params.pageUrl) result.pageUrl = params.pageUrl
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
        const res = await getVisitorLogs(params)
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
    setFilters({ ipAddress: '', pageUrl: '', startDate: '', endDate: '' })
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
            sx={{ minWidth: 180 }} size="small" label={t('visitorLogReport.ipAddress')}
            value={filters.ipAddress}
            onChange={(e) => setFilters({ ...filters, ipAddress: e.target.value })}
          />
          <TextField
            sx={{ minWidth: 180 }} size="small" label={t('visitorLogReport.pageUrl')}
            value={filters.pageUrl}
            onChange={(e) => setFilters({ ...filters, pageUrl: e.target.value })}
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
                  <TableCell>{t('visitorLogReport.id')}</TableCell>
                  <TableCell>{t('visitorLogReport.ipAddress')}</TableCell>
                  <TableCell>{t('visitorLogReport.pageUrl')}</TableCell>
                  <TableCell>{t('visitorLogReport.userAgent')}</TableCell>
                  <TableCell>{t('visitorLogReport.referrer')}</TableCell>
                  <TableCell>{t('visitorLogReport.visitTime')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow sx={{ height: 48 }}>
                    <TableCell colSpan={6} align="center" sx={{ height: 48, py: 0 }}>
                      {t('common.noData')}
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id} hover sx={{ height: 48 }}>
                      <TableCell sx={{ height: 48, py: 0 }}>{log.id}</TableCell>
                      <TableCell sx={{ height: 48, py: 0 }}>{log.ipAddress || '-'}</TableCell>
                      <TableCell sx={{ height: 48, py: 0 }}>{log.pageUrl || '-'}</TableCell>
                      <TableCell sx={{ height: 48, py: 0, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {log.userAgent || '-'}
                      </TableCell>
                      <TableCell sx={{ height: 48, py: 0, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {log.referrer || '-'}
                      </TableCell>
                      <TableCell sx={{ height: 48, py: 0 }}>{new Date(log.visitTime).toLocaleString()}</TableCell>
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
