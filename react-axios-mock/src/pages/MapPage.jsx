import { useState, useEffect, useCallback } from 'react'
import { Box, Typography, Fab, Tooltip } from '@mui/material'
import CesiumMap from '../components/CesiumMap'
import LayerControl from '../components/LayerControl'
import BIMControl from '../components/BIMControl'
import { getBIMModels } from '../api/bim'
import useLayerStore from '../store/layerStore'
import useHexGridStore from '../store/hexGridStore'

export default function MapPage() {
  const [currentBasemap, setCurrentBasemap] = useState('tianditu_vec')
  const [bimData, setBimData] = useState(null)
  const [selectedBimModels, setSelectedBimModels] = useState([])
  const [loadingBim, setLoadingBim] = useState(true)
  const [showBIM, setShowBIM] = useState(true)

  const {
    layers: customLayers,
    fetchLayers,
    toggleLayer,
    addLayer,
    removeLayer,
  } = useLayerStore()

  const {
    cells: hexGridCells,
    fetchCells,
    visible: hexGridVisible,
    setVisible: setHexGridVisible,
    opacity: hexGridOpacity,
    setOpacity: setHexGridOpacity,
  } = useHexGridStore()

  useEffect(() => {
    fetchLayers()
    fetchCells()
  }, [fetchLayers, fetchCells])

  const loadBimData = useCallback(async () => {
    try {
      setLoadingBim(true)
      const res = await getBIMModels()
      setBimData(res.data)
      const activeModels = res.data.models
        .filter((model) => model.status === 'active')
        .map((model) => model.id)
      setSelectedBimModels(activeModels)
    } catch (error) {
      console.error('Failed to load BIM data:', error)
    } finally {
      setLoadingBim(false)
    }
  }, [])

  useEffect(() => {
    loadBimData()
  }, [loadBimData])

  const handleBimModelToggle = (modelId) => {
    setSelectedBimModels((prev) =>
      prev.includes(modelId) ? prev.filter((id) => id !== modelId) : [...prev, modelId]
    )
  }

  const handleBimModelSelect = (model) => {
    console.log('Selected BIM model:', model)
  }

  const activeBimModels = bimData?.models?.filter((model) =>
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
        customLayers={customLayers}
        onToggleLayer={toggleLayer}
        onRemoveLayer={removeLayer}
        onAddLayer={addLayer}
        hexGridVisible={hexGridVisible}
        onToggleHexGrid={() => setHexGridVisible(!hexGridVisible)}
        hexGridOpacity={hexGridOpacity}
        onHexGridOpacity={setHexGridOpacity}
      />

      {!loadingBim && bimData && showBIM && (
        <BIMControl
          bimData={bimData}
          selectedModels={selectedBimModels}
          onModelToggle={handleBimModelToggle}
          onModelSelect={handleBimModelSelect}
          onRefresh={loadBimData}
          onClose={() => setShowBIM(false)}
        />
      )}

      {!showBIM && (
        <Tooltip title="打开BIM模型管理" placement="right">
          <Fab
            size="small"
            color="primary"
            sx={{ position: 'absolute', top: 80, left: 16, zIndex: 1000 }}
            onClick={() => setShowBIM(true)}
          >
            📦
          </Fab>
        </Tooltip>
      )}

      <CesiumMap
        currentBasemap={currentBasemap}
        bimModels={activeBimModels}
        hexGridCells={hexGridVisible ? hexGridCells : []}
        hexGridVisible={hexGridVisible}
        hexGridOpacity={hexGridOpacity}
        customLayers={customLayers}
      />
    </Box>
  )
}
