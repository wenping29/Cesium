import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Typography, Fab, Tooltip } from '@mui/material'
import CesiumMap from '../components/CesiumMap'
import LayerControl from '../components/LayerControl'
import BIMControl from '../components/BIMControl'
import EarthquakeControl from '../components/EarthquakeControl'
import AirQualityControl from '../components/AirQualityControl'
import TyphoonControl from '../components/TyphoonControl'
import WindControl from '../components/WindControl'
import { getBIMModels } from '../api/bim'
import useLayerStore from '../store/layerStore'
import useHexGridStore from '../store/hexGridStore'
import useEarthquakeStore from '../store/earthquakeStore'
import useAirQualityStore from '../store/airQualityStore'
import useTyphoonStore from '../store/typhoonStore'
import useWindStore from '../store/windStore'

export default function MapPage() {
  const { t } = useTranslation()
  const [currentBasemap, setCurrentBasemap] = useState('tianditu_vec')
  const [sceneMode, setSceneMode] = useState('3d')
  const [bimData, setBimData] = useState(null)
  const [selectedBimModels, setSelectedBimModels] = useState([])
  const [loadingBim, setLoadingBim] = useState(true)
  const [showBIM, setShowBIM] = useState(false)

  const {
    layers: customLayers,
    fetchLayers,
    toggleLayer,
    addLayer,
    removeLayer,
    clearAllLayers,
  } = useLayerStore()

  const {
    cells: hexGridCells,
    fetchCells,
    visible: hexGridVisible,
    setVisible: setHexGridVisible,
    opacity: hexGridOpacity,
    setOpacity: setHexGridOpacity,
    cellSizeKm: hexGridCellSizeKm,
    setCellSizeKm: setHexGridCellSizeKm,
  } = useHexGridStore()

  const {
    earthquakes,
    fetchEarthquakes,
    visible: earthquakeVisible,
    setVisible: setEarthquakeVisible,
    heatmapVisible: earthquakeHeatmapVisible,
    setHeatmapVisible: setEarthquakeHeatmapVisible,
    heatmapOpacity: earthquakeHeatmapOpacity,
    setHeatmapOpacity: setEarthquakeHeatmapOpacity,
    heatmapRadius: earthquakeHeatmapRadius,
    setHeatmapRadius: setEarthquakeHeatmapRadius,
  } = useEarthquakeStore()

  const {
    stations: airQualityStations,
    fetchAirQuality,
    visible: airQualityVisible,
    setVisible: setAirQualityVisible,
  } = useAirQualityStore()

  const {
    current: typhoonCurrent,
    historical: typhoonHistorical,
    fetchCurrent: fetchTyphoonCurrent,
    fetchHistorical: fetchTyphoonHistorical,
    visible: typhoonVisible,
    setVisible: setTyphoonVisible,
  } = useTyphoonStore()

  const {
    windData,
    fetchWind,
    visible: windVisible,
    setVisible: setWindVisible,
  } = useWindStore()

  const [selectedEarthquake, setSelectedEarthquake] = useState(null)
  const [selectedStation, setSelectedStation] = useState(null)
  const [selectedTyphoon, setSelectedTyphoon] = useState(null)
  const [selectedWind, setSelectedWind] = useState(null)

  useEffect(() => {
    fetchLayers()
    fetchCells()
  }, [fetchLayers, fetchCells])

  useEffect(() => {
    if (earthquakeVisible || earthquakeHeatmapVisible) fetchEarthquakes()
  }, [earthquakeVisible, earthquakeHeatmapVisible, fetchEarthquakes])

  useEffect(() => {
    if (airQualityVisible) fetchAirQuality()
  }, [airQualityVisible, fetchAirQuality])

  useEffect(() => {
    if (typhoonVisible) {
      fetchTyphoonCurrent()
      fetchTyphoonHistorical()
    }
  }, [typhoonVisible, fetchTyphoonCurrent, fetchTyphoonHistorical])

  useEffect(() => {
    if (windVisible) fetchWind()
  }, [windVisible, fetchWind])

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

  const handleClearBim = () => {
    setSelectedBimModels([])
  }

  const activeBimModels = bimData?.models?.filter((model) =>
    selectedBimModels.includes(model.id)
  ) || []

  const moduleControlProps = [
    earthquakeVisible && {
      key: 'earthquake',
      Component: EarthquakeControl,
      props: {
        earthquakes,
        onClose: () => setEarthquakeVisible(false),
        onEarthquakeClick: (eq) => setSelectedEarthquake(eq),
      },
    },
    airQualityVisible && {
      key: 'airQuality',
      Component: AirQualityControl,
      props: {
        stations: airQualityStations,
        onClose: () => setAirQualityVisible(false),
        onStationClick: (s) => setSelectedStation(s),
      },
    },
    typhoonVisible && {
      key: 'typhoon',
      Component: TyphoonControl,
      props: {
        current: typhoonCurrent,
        historical: typhoonHistorical,
        onClose: () => setTyphoonVisible(false),
        onTyphoonClick: (ty) => setSelectedTyphoon(ty),
      },
    },
    windVisible && {
      key: 'wind',
      Component: WindControl,
      props: {
        windData,
        onClose: () => setWindVisible(false),
        onWindClick: (w) => setSelectedWind(w),
      },
    },
  ].filter(Boolean)

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
        sceneMode={sceneMode}
        onSceneModeChange={setSceneMode}
        customLayers={customLayers}
        onToggleLayer={toggleLayer}
        onRemoveLayer={removeLayer}
        onAddLayer={addLayer}
        onClearAllLayers={clearAllLayers}
        hexGridVisible={hexGridVisible}
        onToggleHexGrid={() => setHexGridVisible(!hexGridVisible)}
        hexGridOpacity={hexGridOpacity}
        onHexGridOpacity={setHexGridOpacity}
        hexGridCellSizeKm={hexGridCellSizeKm}
        onHexGridCellSizeKm={setHexGridCellSizeKm}
        earthquakeVisible={earthquakeVisible}
        onToggleEarthquake={() => setEarthquakeVisible(!earthquakeVisible)}
        earthquakeHeatmapVisible={earthquakeHeatmapVisible}
        onToggleEarthquakeHeatmap={() => setEarthquakeHeatmapVisible(!earthquakeHeatmapVisible)}
        airQualityVisible={airQualityVisible}
        onToggleAirQuality={() => setAirQualityVisible(!airQualityVisible)}
        typhoonVisible={typhoonVisible}
        onToggleTyphoon={() => setTyphoonVisible(!typhoonVisible)}
        windVisible={windVisible}
        onToggleWind={() => setWindVisible(!windVisible)}
      />

      {!loadingBim && bimData && showBIM && (
        <BIMControl
          bimData={bimData}
          selectedModels={selectedBimModels}
          onModelToggle={handleBimModelToggle}
          onModelSelect={handleBimModelSelect}
          onRefresh={loadBimData}
          onClose={() => setShowBIM(false)}
          onClear={handleClearBim}
        />
      )}

      {!showBIM && (
        <Tooltip title={t('bim.open')} placement="right">
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

      {moduleControlProps.map((m, i) => (
        <Box key={m.key} sx={{ position: 'absolute', top: 80 + i * 380, right: 340, zIndex: 1000 }}>
          <m.Component {...m.props} />
        </Box>
      ))}

      <CesiumMap
        currentBasemap={currentBasemap}
        sceneMode={sceneMode}
        bimModels={activeBimModels}
        hexGridCells={hexGridVisible ? hexGridCells : []}
        hexGridVisible={hexGridVisible}
        hexGridOpacity={hexGridOpacity}
        customLayers={customLayers}
        earthquakeData={earthquakes}
        earthquakeVisible={earthquakeVisible}
        earthquakeHeatmapVisible={earthquakeHeatmapVisible}
        earthquakeHeatmapOpacity={earthquakeHeatmapOpacity}
        earthquakeHeatmapRadius={earthquakeHeatmapRadius}
        selectedEarthquake={selectedEarthquake}
        typhoonData={{ current: typhoonCurrent, historical: typhoonHistorical }}
        typhoonVisible={typhoonVisible}
        selectedTyphoon={selectedTyphoon}
        windData={windData}
        windVisible={windVisible}
        selectedWind={selectedWind}
      />
    </Box>
  )
}
