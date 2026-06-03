import { useState, useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import CesiumMap from '../components/CesiumMap'
import LayerControl from '../components/LayerControl'
import BIMControl from '../components/BIMControl'
import { getBIMModels } from '../api/bim'

export default function MapPage() {
  const [currentBasemap, setCurrentBasemap] = useState('tianditu_vec')
  const [bimData, setBimData] = useState(null)
  const [selectedBimModels, setSelectedBimModels] = useState([])
  const [loadingBim, setLoadingBim] = useState(true)

  // 加载BIM数据
  const loadBimData = async () => {
    try {
      setLoadingBim(true)
      const res = await getBIMModels()
      setBimData(res.data)
      
      // 默认选择所有已激活的模型
      const activeModels = res.data.models
        .filter(model => model.status === 'active')
        .map(model => model.id)
      setSelectedBimModels(activeModels)
    } catch (error) {
      console.error('Failed to load BIM data:', error)
    } finally {
      setLoadingBim(false)
    }
  }

  useEffect(() => {
    loadBimData()
  }, [])

  // 切换BIM模型显示
  const handleBimModelToggle = (modelId) => {
    setSelectedBimModels(prev => {
      if (prev.includes(modelId)) {
        return prev.filter(id => id !== modelId)
      } else {
        return [...prev, modelId]
      }
    })
  }

  // 选择BIM模型（飞行到模型位置）
  const handleBimModelSelect = (model) => {
    // 可以在这里添加额外的选择逻辑
    console.log('Selected BIM model:', model)
  }

  // 获取当前选中的BIM模型数据
  const activeBimModels = bimData?.models?.filter(model => 
    selectedBimModels.includes(model.id)
  ) || []

  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
      <Typography
        variant="h6"
        sx={{
          position: 'absolute', top: 16, left: 16, zIndex: 10,
          color: 'white', bgcolor: 'rgba(0,0,0,0.5)', px: 2, py: 0.5, borderRadius: 1,
        }}
      >
        Cesium 3D Map
      </Typography>
      
      <LayerControl 
        currentBasemap={currentBasemap} 
        onBasemapChange={setCurrentBasemap} 
      />
      
      {!loadingBim && bimData && (
        <BIMControl
          bimData={bimData}
          selectedModels={selectedBimModels}
          onModelToggle={handleBimModelToggle}
          onModelSelect={handleBimModelSelect}
          onRefresh={loadBimData}
        />
      )}
      
      <CesiumMap 
        currentBasemap={currentBasemap} 
        bimModels={activeBimModels}
      />
    </Box>
  )
}
