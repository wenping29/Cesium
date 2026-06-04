import { useEffect, useRef, useState, useCallback } from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getCities } from '../api/cesium'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const TIANDITU_TOKEN = import.meta.env.VITE_TIANDITU_TOKEN || ''

const BASEMAP_PROVIDERS = {
  tianditu_vec: {
    url: `https://t0.tianditu.gov.cn/vec_w/wmts?tk=${TIANDITU_TOKEN}&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}`,
    attribution: '&copy; Tianditu',
    maxZoom: 18,
  },
  tianditu_img: {
    url: `https://t0.tianditu.gov.cn/img_w/wmts?tk=${TIANDITU_TOKEN}&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}`,
    attribution: '&copy; Tianditu',
    maxZoom: 18,
  },
  tianditu_ter: {
    url: `https://t0.tianditu.gov.cn/ter_w/wmts?tk=${TIANDITU_TOKEN}&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}`,
    attribution: '&copy; Tianditu',
    maxZoom: 14,
  },
  amap_vec: {
    url: 'https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
    attribution: '&copy; AutoNavi',
    maxZoom: 18,
  },
  amap_img: {
    url: 'https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
    attribution: '&copy; AutoNavi',
    maxZoom: 18,
  },
  osm: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap',
    maxZoom: 19,
  },
}

function createTileLayer(basemapId) {
  const cfg = BASEMAP_PROVIDERS[basemapId]
  if (!cfg) return L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap',
    maxZoom: 19,
  })
  return L.tileLayer(cfg.url, {
    attribution: cfg.attribution,
    maxZoom: cfg.maxZoom || 18,
  })
}

function getMagnitudeColor(mag) {
  if (mag < 3) return '#4caf50'
  if (mag < 5) return '#ff9800'
  if (mag < 7) return '#f44336'
  return '#9c27b0'
}

function getWindSpeedColor(speed) {
  if (speed < 5) return '#4caf50'
  if (speed < 10) return '#ff9800'
  return '#f44336'
}

export default function LeafletMap({
  currentBasemap = 'tianditu_vec',
  hexGridCells = [],
  hexGridVisible = false,
  hexGridOpacity = 0.6,
  customLayers = [],
  earthquakeData = [],
  earthquakeVisible = false,
  selectedEarthquake = null,
  typhoonData = { current: null, historical: [] },
  typhoonVisible = false,
  selectedTyphoon = null,
  windData = [],
  windVisible = false,
  selectedWind = null,
}) {
  const containerRef = useRef(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const mapRef = useRef(null)
  const basemapLayerRef = useRef(null)
  const cityGroupRef = useRef(null)
  const hexGroupRef = useRef(null)
  const earthquakeGroupRef = useRef(null)
  const typhoonGroupRef = useRef(null)
  const windGroupRef = useRef(null)
  const customLayerRefs = useRef({})

  const addCityMarkers = useCallback(async (map) => {
    if (!map) return
    if (cityGroupRef.current) map.removeLayer(cityGroupRef.current)

    const group = L.layerGroup()
    try {
      const res = await getCities()
      const data = res.data
      if (data) {
        data.forEach((city) => {
          const marker = L.circleMarker([city.lat, city.lng], {
            radius: 6,
            fillColor: '#1e90ff',
            fillOpacity: 1,
            color: '#fff',
            weight: 2,
          })
          marker.bindPopup(`<div style="padding:8px"><strong>${city.name}</strong></div>`)
          marker.bindTooltip(city.name, { offset: [0, -18], direction: 'top' })
          group.addLayer(marker)
        })
      }
    } catch (err) {
      console.error('Failed to load cities:', err)
    }
    group.addTo(map)
    cityGroupRef.current = group
  }, [])

  const initMap = useCallback(() => {
    const el = containerRef.current
    if (!el) return

    try {
      const map = L.map(el, {
        center: [35, 108],
        zoom: 5,
        maxZoom: 18,
        zoomControl: true,
      })

      const basemapLayer = createTileLayer(currentBasemap)
      basemapLayer.addTo(map)
      basemapLayerRef.current = basemapLayer

      hexGroupRef.current = L.layerGroup().addTo(map)
      earthquakeGroupRef.current = L.layerGroup().addTo(map)
      typhoonGroupRef.current = L.layerGroup().addTo(map)
      windGroupRef.current = L.layerGroup().addTo(map)

      map.on('click', () => {
        map.closePopup()
      })

      mapRef.current = map
      return map
    } catch (err) {
      console.error('Leaflet init error:', err)
      setError(err.message || 'Failed to initialize map')
      return null
    }
  }, [currentBasemap])

  useEffect(() => {
    let cancelled = false

    async function init() {
      const map = initMap()
      if (!map) {
        if (!cancelled) setLoading(false)
        return
      }

      await addCityMarkers(map)

      if (!cancelled) setLoading(false)
    }

    init()

    return () => {
      cancelled = true
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [initMap, addCityMarkers])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    if (basemapLayerRef.current) map.removeLayer(basemapLayerRef.current)

    const newBasemap = createTileLayer(currentBasemap)
    newBasemap.addTo(map)
    basemapLayerRef.current = newBasemap
  }, [currentBasemap])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    Object.keys(customLayerRefs.current).forEach((key) => {
      const l = customLayerRefs.current[key]
      if (l) map.removeLayer(l)
    })
    customLayerRefs.current = {}

    const active = customLayers.filter((l) => l.visible)
    active.forEach((layer) => {
      let tileLayer = null
      if (layer.type === 'xyz' || layer.type === 'wms') {
        const url = layer.type === 'wms'
          ? layer.url
          : layer.url
        tileLayer = L.tileLayer(url, {
          maxZoom: layer.maxLevel || 18,
          opacity: layer.opacity ?? 1.0,
          ...(layer.type === 'wms' ? {
            layers: layer.layers,
            format: layer.format || 'image/png',
            transparent: layer.transparent !== false,
          } : {}),
        })
      } else if (layer.type === 'wmts') {
        tileLayer = L.tileLayer(layer.url, {
          maxZoom: layer.maxLevel || 18,
          opacity: layer.opacity ?? 1.0,
        })
      }
      if (tileLayer) {
        tileLayer.addTo(map)
        customLayerRefs.current[layer.id] = tileLayer
      }
    })
  }, [customLayers])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const group = hexGroupRef.current
    group.clearLayers()

    if (!hexGridVisible || !hexGridCells.length) return

    hexGridCells.forEach((cell) => {
      const latlngs = cell.vertices.map((v) => [v.lat, v.lng])
      const polygon = L.polygon(latlngs, {
        color: `rgba(42, 106, 176, ${Math.min(hexGridOpacity + 0.2, 1)})`,
        fillColor: `rgba(74, 144, 226, ${hexGridOpacity})`,
        fillOpacity: hexGridOpacity,
        weight: 1,
      })
      group.addLayer(polygon)
    })
  }, [hexGridCells, hexGridVisible, hexGridOpacity])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const group = earthquakeGroupRef.current
    group.clearLayers()

    if (!earthquakeVisible || !earthquakeData.length) return

    earthquakeData.forEach((eq) => {
      const color = getMagnitudeColor(eq.magnitude)
      const marker = L.circleMarker([eq.lat, eq.lng], {
        radius: Math.max(5, eq.magnitude * 2),
        fillColor: color,
        fillOpacity: 0.8,
        color: '#fff',
        weight: 2,
      })
      marker.bindPopup(`
        <div style="padding:10px;min-width:200px">
          <h3 style="margin:0 0 8px">${eq.region}</h3>
          <p><strong>Magnitude:</strong> ${eq.magnitude}</p>
          <p><strong>Depth:</strong> ${eq.depth} km</p>
          <p><strong>Time:</strong> ${eq.time}</p>
          <p>${eq.description || ''}</p>
        </div>
      `)
      marker.bindTooltip(`M${eq.magnitude.toFixed(1)}`, {
        offset: [0, -16],
        direction: 'top',
      })
      group.addLayer(marker)
    })
  }, [earthquakeData, earthquakeVisible])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !selectedEarthquake || !earthquakeVisible) return

    map.flyTo([selectedEarthquake.lat, selectedEarthquake.lng], 8, { duration: 1 })
  }, [selectedEarthquake, earthquakeVisible])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const group = typhoonGroupRef.current
    group.clearLayers()

    if (!typhoonVisible) return

    const { current, historical } = typhoonData

    if (current) {
      const pathLatLngs = (current.path || []).map((p) => [p[1], p[0]])
      if (pathLatLngs.length >= 2) {
        const polyline = L.polyline(pathLatLngs, {
          color: '#42a5f5',
          weight: 3,
          opacity: 0.8,
        })
        polyline.bindPopup(`<div style="padding:8px"><strong>${current.name} Path</strong></div>`)
        group.addLayer(polyline)
      }

      const marker = L.circleMarker([current.lat, current.lng], {
        radius: 12,
        fillColor: '#42a5f5',
        fillOpacity: 0.8,
        color: '#fff',
        weight: 3,
      })
      marker.bindPopup(`
        <div style="padding:10px">
          <h3 style="margin:0 0 8px">${current.name}</h3>
          <p><strong>Strength:</strong> ${current.strength}</p>
          <p><strong>Wind Speed:</strong> ${current.windSpeed} m/s</p>
          <p><strong>Pressure:</strong> ${current.pressure} hPa</p>
          <p><strong>Time:</strong> ${current.time}</p>
        </div>
      `)
      marker.bindTooltip(`${current.name} (${current.windSpeed}m/s)`, {
        offset: [0, -20],
        direction: 'top',
      })
      group.addLayer(marker)
    }

    historical.forEach((ty) => {
      const marker = L.circleMarker([ty.lat, ty.lng], {
        radius: 6,
        fillColor: '#42a5f5',
        fillOpacity: 0.4,
        color: '#fff',
        weight: 1,
      })
      marker.bindPopup(`
        <div style="padding:10px">
          <h3 style="margin:0 0 8px">${ty.name}</h3>
          <p><strong>Strength:</strong> ${ty.strength}</p>
          <p><strong>Wind Speed:</strong> ${ty.windSpeed} m/s</p>
          <p><strong>Pressure:</strong> ${ty.pressure} hPa</p>
          <p><strong>Time:</strong> ${ty.time}</p>
        </div>
      `)
      marker.bindTooltip(ty.name, { offset: [0, -14], direction: 'top' })
      group.addLayer(marker)
    })
  }, [typhoonData, typhoonVisible])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !selectedTyphoon || !typhoonVisible) return

    map.flyTo([selectedTyphoon.lat, selectedTyphoon.lng], 7, { duration: 1 })
  }, [selectedTyphoon, typhoonVisible])

  function idwInterpolate(gridLng, gridLat, data) {
    let weightedSpeed = 0, weightedCos = 0, weightedSin = 0, totalW = 0
    for (const s of data) {
      const d = Math.sqrt((s.lng - gridLng) ** 2 + (s.lat - gridLat) ** 2)
      if (d < 0.01) return { speed: s.speed, direction: s.direction }
      const w = 1 / (d * d)
      const rad = (s.direction * Math.PI) / 180
      weightedSpeed += w * s.speed
      weightedCos += w * Math.cos(rad)
      weightedSin += w * Math.sin(rad)
      totalW += w
    }
    return {
      speed: weightedSpeed / totalW,
      direction: ((Math.atan2(weightedSin, weightedCos) * 180) / Math.PI + 360) % 360,
    }
  }

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const group = windGroupRef.current
    group.clearLayers()

    if (!windVisible || !windData.length) return

    const lats = windData.map((w) => w.lat)
    const lngs = windData.map((w) => w.lng)
    const minLat = Math.min(...lats) - 3
    const maxLat = Math.max(...lats) + 3
    const minLng = Math.min(...lngs) - 3
    const maxLng = Math.max(...lngs) + 3
    const step = 2
    const gridRows = Math.ceil((maxLat - minLat) / step)
    const gridCols = Math.ceil((maxLng - minLng) / step)

    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        const gridLng = minLng + c * step + step / 2
        const gridLat = minLat + r * step + step / 2
        const { speed, direction } = idwInterpolate(gridLng, gridLat, windData)
        const color = getWindSpeedColor(speed)

        const marker = L.circleMarker([gridLat, gridLng], {
          radius: 4,
          fillColor: color,
          fillOpacity: 0.8,
          color: '#fff',
          weight: 1,
        })
        group.addLayer(marker)

        const rad = (direction * Math.PI) / 180
        const len = 10
        const endLat = gridLat + (len * Math.cos(rad)) / 111
        const endLng = gridLng + (len * Math.sin(rad)) / (111 * Math.cos((gridLat * Math.PI) / 180))

        const arrow = L.polyline([[gridLat, gridLng], [endLat, endLng]], {
          color,
          weight: 2,
          opacity: 0.6,
        })
        group.addLayer(arrow)
      }
    }

    windData.forEach((w) => {
      const color = getWindSpeedColor(w.speed)
      const marker = L.circleMarker([w.lat, w.lng], {
        radius: 8,
        fillColor: color,
        fillOpacity: 0.8,
        color: '#fff',
        weight: 2,
      })
      marker.bindPopup(`
        <div style="padding:10px">
          <h3 style="margin:0 0 8px">${w.region}</h3>
          <p><strong>Direction:</strong> ${w.direction}°</p>
          <p><strong>Speed:</strong> ${w.speed} m/s</p>
          <p><strong>Gust:</strong> ${w.gust} m/s</p>
        </div>
      `)
      marker.bindTooltip(`${w.region} ${w.speed.toFixed(1)}m/s`, {
        offset: [0, -16],
        direction: 'top',
      })
      group.addLayer(marker)
    })
  }, [windData, windVisible])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !selectedWind || !windVisible) return

    map.flyTo([selectedWind.lat, selectedWind.lng], 7, { duration: 1 })
  }, [selectedWind, windVisible])

  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      {loading && (
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}
    </Box>
  )
}
