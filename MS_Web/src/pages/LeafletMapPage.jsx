import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Typography } from '@mui/material'
import LeafletMap from '../components/LeafletMap'
import LayerControl from '../components/LayerControl'
import EarthquakeControl from '../components/EarthquakeControl'
import AirQualityControl from '../components/AirQualityControl'
import TyphoonControl from '../components/TyphoonControl'
import WindControl from '../components/WindControl'
import { generateHexGrid } from '../utils/hexGrid'
import useLayerStore from '../store/layerStore'
import useEarthquakeStore from '../store/earthquakeStore'
import useAirQualityStore from '../store/airQualityStore'
import useTyphoonStore from '../store/typhoonStore'
import useWindStore from '../store/windStore'

export default function LeafletMapPage() {
  const { t } = useTranslation()
  const [currentBasemap, setCurrentBasemap] = useState('tianditu_vec')
  const [hexGridCells, setHexGridCells] = useState([])
  const [hexGridVisible, setHexGridVisible] = useState(false)
  const [hexGridOpacity, setHexGridOpacity] = useState(0.6)
  const [hexGridCellSizeKm, setHexGridCellSizeKm] = useState(5)

  const {
    layers: customLayers,
    fetchLayers,
    toggleLayer,
    addLayer,
    removeLayer,
    clearAllLayers,
  } = useLayerStore()

  const {
    earthquakes,
    fetchEarthquakes,
    visible: earthquakeVisible,
    setVisible: setEarthquakeVisible,
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
    //fetchLayers()
  }, [fetchLayers])

  useEffect(() => {
    setHexGridCells(generateHexGrid(hexGridCellSizeKm))
  }, [hexGridCellSizeKm])

  useEffect(() => {
    if (earthquakeVisible) fetchEarthquakes()
  }, [earthquakeVisible, fetchEarthquakes])

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
        {t('map.leafletTitle')}
      </Typography>

      <LayerControl
        currentBasemap={currentBasemap}
        onBasemapChange={setCurrentBasemap}
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
        airQualityVisible={airQualityVisible}
        onToggleAirQuality={() => setAirQualityVisible(!airQualityVisible)}
        typhoonVisible={typhoonVisible}
        onToggleTyphoon={() => setTyphoonVisible(!typhoonVisible)}
        windVisible={windVisible}
        onToggleWind={() => setWindVisible(!windVisible)}
      />

      {moduleControlProps.map((m, i) => (
        <Box key={m.key} sx={{ position: 'absolute', top: 80 + i * 380, right: 340, zIndex: 1000 }}>
          <m.Component {...m.props} />
        </Box>
      ))}

      <LeafletMap
        currentBasemap={currentBasemap}
        hexGridCells={hexGridVisible ? hexGridCells : []}
        hexGridVisible={hexGridVisible}
        hexGridOpacity={hexGridOpacity}
        customLayers={customLayers}
        earthquakeData={earthquakes}
        earthquakeVisible={earthquakeVisible}
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
