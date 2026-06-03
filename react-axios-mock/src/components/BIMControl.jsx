import { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Divider,
  Collapse,
  Switch,
  FormControlLabel,
  CircularProgress
} from '@mui/material'
import {
  ExpandMore,
  ExpandLess,
  Refresh,
  Close,
} from '@mui/icons-material'

// BIM类型图标映射
const TYPE_ICONS = {
  building: '🏢',
  bridge: '🌉',
  tunnel: '🚇',
  facility: '🏭',
  pipeline: '🔧'
}

export default function BIMControl({
  bimData,
  selectedModels,
  onModelToggle,
  onModelSelect,
  onRefresh,
  onClose
}) {
  const [expanded, setExpanded] = useState(true)
  const [loading, setLoading] = useState(false)
  const [typeExpanded, setTypeExpanded] = useState({})

  useEffect(() => {
    // 默认展开所有类型
    if (bimData?.types) {
      const initialExpanded = {}
      bimData.types.forEach(type => {
        initialExpanded[type.id] = true
      })
      setTypeExpanded(initialExpanded)
    }
  }, [bimData])

  const handleRefresh = async () => {
    setLoading(true)
    try {
      await onRefresh?.()
    } finally {
      setLoading(false)
    }
  }

  const toggleType = (typeId) => {
    setTypeExpanded(prev => ({
      ...prev,
      [typeId]: !prev[typeId]
    }))
  }

  const modelsByType = bimData?.models?.reduce((acc, model) => {
    if (!acc[model.type]) {
      acc[model.type] = []
    }
    acc[model.type].push(model)
    return acc
  }, {}) || {}

  if (!bimData) {
    return (
      <Paper
        sx={{
          position: 'absolute',
          top: 80,
          left: 16,
          zIndex: 1000,
          p: 2,
          width: 320,
          maxHeight: 'calc(100% - 100px)',
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={24} />
          <Typography sx={{ ml: 1 }}>加载BIM数据...</Typography>
        </Box>
      </Paper>
    )
  }

  return (
    <Paper
      sx={{
        position: 'absolute',
        top: 80,
        left: 16,
        zIndex: 1000,
        width: 320,
        maxHeight: 'calc(100% - 100px)',
        bgcolor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* 标题栏 */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          📦 BIM模型管理
          <Chip label={`${bimData.total || 0}`} size="small" color="primary" />
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton size="small" onClick={handleRefresh} disabled={loading}>
            <Refresh fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
          <IconButton size="small" onClick={onClose}>
            <Close fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Divider />

      {/* 模型列表 */}
      <Collapse in={expanded}>
        <Box sx={{ overflow: 'auto', flex: 1, maxHeight: 'calc(100vh - 280px)' }}>
          {bimData.types?.map((type) => (
            <Box key={type.id}>
              {/* 类型标题 */}
              <ListItemButton
                onClick={() => toggleType(type.id)}
                sx={{ bgcolor: 'grey.100' }}
              >
                <ListItemIcon>
                  <Typography>{TYPE_ICONS[type.id] || '📁'}</Typography>
                </ListItemIcon>
                <ListItemText
                  primary={type.name}
                  secondary={`${modelsByType[type.id]?.length || 0} 个模型`}
                />
                {typeExpanded[type.id] ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>

              {/* 模型列表 */}
              <Collapse in={typeExpanded[type.id]}>
                <List dense>
                  {modelsByType[type.id]?.map((model) => (
                    <ListItem
                      key={model.id}
                      sx={{
                        bgcolor: selectedModels.includes(model.id) ? 'action.selected' : 'transparent'
                      }}
                    >
                      <ListItemButton
                        onClick={() => onModelSelect?.(model)}
                        sx={{ py: 0.5 }}
                      >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              bgcolor: model.status === 'active' ? 'success.main' : 'warning.main'
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={model.name}
                          secondary={
                            <Box component="span" sx={{ fontSize: '0.75rem' }}>
                              {model.status === 'active' ? '已激活' : `进度: ${model.progress}%`}
                            </Box>
                          }
                          primaryTypographyProps={{ noWrap: true }}
                        />
                        <ListItemSecondaryAction>
                          <FormControlLabel
                            control={
                              <Switch
                                size="small"
                                checked={selectedModels.includes(model.id)}
                                onChange={() => onModelToggle?.(model.id)}
                              />
                            }
                            label=""
                          />
                        </ListItemSecondaryAction>
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </Box>
          ))}
        </Box>
      </Collapse>
    </Paper>
  )
}