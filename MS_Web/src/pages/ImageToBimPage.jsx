import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box, Typography, Paper, Button, LinearProgress, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip, CircularProgress,
  IconButton, Tooltip, Collapse, Alert,
} from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import RefreshIcon from '@mui/icons-material/Refresh'
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep'
import InsightsIcon from '@mui/icons-material/Insights'
import { uploadAndConvert } from '../api/imageToBim'
import useImageToBimStore from '../store/imageToBimStore'

function getConfidenceColor(confidence) {
  if (confidence >= 0.85) return 'success'
  if (confidence >= 0.7) return 'warning'
  return 'error'
}

function getTypeColor(type) {
  const map = { building: 'primary', bridge: 'secondary', tunnel: 'info', facility: 'warning', pipeline: 'default' }
  return map[type] || 'default'
}

export default function ImageToBimPage() {
  const { t } = useTranslation()
  const fileInputRef = useRef(null)
  const {
    conversions, loading, currentConversion,
    fetchHistory, fetchResult, setUploading, clearCurrent,
  } = useImageToBimStore()

  const [dragging, setDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [progressValue, setProgressValue] = useState(0)
  const [error, setError] = useState(null)
  const [expandedResult, setExpandedResult] = useState(null)

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const simulateProgress = () => {
    setProgressValue(0)
    const interval = setInterval(() => {
      setProgressValue((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return 95
        }
        return prev + RandomStep()
      })
    }, 200)
    return interval
  }

  function RandomStep() {
    return Math.random() * 10 + 2
  }

  const handleFileSelect = (file) => {
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      setError(t('imageToBim.fileTooLarge'))
      return
    }
    setError(null)
    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setProcessing(true)
    setUploading(true)
    clearCurrent()
    setExpandedResult(null)

    const progressInterval = simulateProgress()

    try {
      const formData = new FormData()
      formData.append('image', selectedFile)

      const res = await uploadAndConvert(formData)
      setProgressValue(100)

      setTimeout(() => {
        setProcessing(false)
        setUploading(false)
        setSelectedFile(null)
        useImageToBimStore.getState().setCurrentConversion(res.data)

        fetchHistory()
      }, 500)
    } catch {
      setError(t('imageToBim.convertFailed'))
      setProcessing(false)
      setUploading(false)
    }

    clearInterval(progressInterval)
  }

  const handleViewDetail = async (record) => {
    if (expandedResult === record.id) {
      setExpandedResult(null)
      return
    }
    setExpandedResult(record.id)
    try {
      await fetchResult(record.id)
    } catch {
      // silent
    }
  }

  const formatConfidence = (val) => `${(val * 100).toFixed(0)}%`

  return (
    <Box sx={{ p: 2, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
        <InsightsIcon /> {t('imageToBim.title')}
      </Typography>

      {/* Upload Area */}
      <Paper
        sx={{
          p: 2, mb: 3, textAlign: 'center',
          border: '2px dashed',
          borderColor: dragging ? 'primary.main' : error ? 'error.main' : 'grey.300',
          bgcolor: dragging ? 'action.hover' : 'background.paper',
          transition: 'all 0.2s',
          cursor: selectedFile ? 'default' : 'pointer',
        }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFileSelect(e.dataTransfer.files[0]) }}
        onClick={() => !selectedFile && !processing && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => handleFileSelect(e.target.files[0])}
        />

        {processing ? (
          <Box sx={{ py: 2 }}>
            <CircularProgress size={48} sx={{ mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>{t('imageToBim.processing')}</Typography>
            <LinearProgress variant="determinate" value={progressValue} sx={{ maxWidth: 400, mx: 'auto' }} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {t('imageToBim.processingHint')}
            </Typography>
          </Box>
        ) : selectedFile ? (
          <Box sx={{ py: 2 }}>
            <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography variant="body1" sx={{ mb: 1 }}>
              {selectedFile.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {(selectedFile.size / 1024).toFixed(1)} KB
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                onClick={handleUpload}
                startIcon={<CloudUploadIcon />}
              >
                {t('imageToBim.startConvert')}
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => { setSelectedFile(null); setError(null) }}
              >
                {t('imageToBim.cancel')}
              </Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ py: 2 }}>
            <CloudUploadIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>{t('imageToBim.dropHint')}</Typography>
            <Typography variant="body2" color="text.secondary">
              {t('imageToBim.supportFormat')}
            </Typography>
          </Box>
        )}
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Current Conversion Result */}
      {currentConversion && (
        <Paper sx={{ mb: 3, overflow: 'hidden' }}>
          <Box sx={{ p: 2, bgcolor: 'success.dark', color: 'success.contrastText', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {t('imageToBim.convertResult')}
            </Typography>
            <Chip
              label={t('imageToBim.detectedCount', { count: currentConversion.detectedCount })}
              size="small"
              color="default"
              sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,0.2)' }}
            />
          </Box>
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {t('imageToBim.processingTime')}: {(currentConversion.processingTime / 1000).toFixed(1)}s
              &nbsp;|&nbsp; {t('imageToBim.imageName')}: {currentConversion.imageName}
            </Typography>

            <TableContainer sx={{ maxHeight: 400, overflow: 'auto' }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('imageToBim.name')}</TableCell>
                    <TableCell>{t('imageToBim.type')}</TableCell>
                    <TableCell>{t('imageToBim.height')}</TableCell>
                    <TableCell>{t('imageToBim.area')}</TableCell>
                    <TableCell>{t('imageToBim.confidence')}</TableCell>
                    <TableCell>{t('imageToBim.position')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentConversion.models?.map((model) => (
                    <TableRow key={model.id} hover sx={{ height: 48 }}>
                      <TableCell sx={{ height: 48, py: 0 }}>{model.name}</TableCell>
                      <TableCell sx={{ height: 48, py: 0 }}>
                        <Chip label={model.type} size="small" color={getTypeColor(model.type)} variant="outlined" />
                      </TableCell>
                      <TableCell sx={{ height: 48, py: 0 }}>{model.height.toFixed(1)} m</TableCell>
                      <TableCell sx={{ height: 48, py: 0 }}>{model.area} m²</TableCell>
                      <TableCell sx={{ height: 48, py: 0 }}>
                        <Chip
                          label={formatConfidence(model.confidence)}
                          size="small"
                          color={getConfidenceColor(model.confidence)}
                        />
                      </TableCell>
                      <TableCell sx={{ height: 48, py: 0 }}>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                          ({model.position.lng.toFixed(4)}, {model.position.lat.toFixed(4)})
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Paper>
      )}

      {/* History */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {t('imageToBim.history')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={t('imageToBim.refresh')}>
            <IconButton size="small" onClick={fetchHistory} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('imageToBim.clearHistory')}>
            <IconButton size="small" color="error" onClick={clearCurrent}>
              <DeleteSweepIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : conversions.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">{t('imageToBim.noHistory')}</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('imageToBim.imageName')}</TableCell>
                <TableCell>{t('imageToBim.status')}</TableCell>
                <TableCell>{t('imageToBim.detectedCount')}</TableCell>
                <TableCell>{t('imageToBim.processingTime')}</TableCell>
                <TableCell>{t('imageToBim.createdAt')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {conversions.map((record) => (
                <>
                  <TableRow
                    key={record.id}
                    hover
                    sx={{ cursor: 'pointer', height: 48 }}
                    onClick={() => handleViewDetail(record)}
                  >
                    <TableCell sx={{ height: 48, py: 0 }}>{record.imageName}</TableCell>
                    <TableCell sx={{ height: 48, py: 0 }}>
                      <Chip
                        label={record.status === 'completed' ? t('imageToBim.completed') : record.status}
                        size="small"
                        color={record.status === 'completed' ? 'success' : 'warning'}
                      />
                    </TableCell>
                    <TableCell sx={{ height: 48, py: 0 }}>{record.modelCount || record.detectedCount}</TableCell>
                    <TableCell sx={{ height: 48, py: 0 }}>{(record.processingTime / 1000).toFixed(1)}s</TableCell>
                    <TableCell sx={{ height: 48, py: 0 }}>{record.createdAt}</TableCell>
                  </TableRow>
                  {expandedResult === record.id && (
                    <TableRow>
                      <TableCell colSpan={5} sx={{ py: 0 }}>
                        <Collapse in={expandedResult === record.id}>
                          <Box sx={{ py: 2 }}>
                            {record.detectedCount > 0 ? (
                              <Typography variant="body2" color="text.secondary">
                                检测到 {record.detectedCount} 个建筑对象
                              </Typography>
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                {t('imageToBim.clickToView')}
                              </Typography>
                            )}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}
