import { useEffect, useRef, useState, useCallback } from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getCities } from '../api/cesium'

const HeatmapCanvas = L.Layer.extend({
  initialize: function (options) {
    L.setOptions(this, options)
    this._data = []
  },
  onAdd: function (map) {
    this._map = map
    const canvas = L.DomUtil.create('canvas', 'leaflet-heatmap-canvas')
    this._canvas = canvas
    this._ctx = canvas.getContext('2d')
    const pane = map.getPane('overlayPane')
    pane.appendChild(canvas)
    map.on('moveend', this._reset, this)
    map.on('zoomend', this._reset, this)
    this._reset()
  },
  onRemove: function (map) {
    map.off('moveend', this._reset, this)
    map.off('zoomend', this._reset, this)
    const parent = this._canvas && this._canvas.parentNode
    if (parent) parent.removeChild(this._canvas)
  },
  setData: function (data) {
    this._data = data || []
    if (this._map) this._reset()
  },
  _reset: function () {
    const map = this._map
    const size = map.getSize()
    const canvas = this._canvas
    canvas.width = size.x
    canvas.height = size.y
    canvas.style.width = size.x + 'px'
    canvas.style.height = size.y + 'px'
    canvas.style.pointerEvents = 'none'
    this._draw()
  },
  _draw: function () {
    const ctx = this._ctx
    const map = this._map
    const data = this._data
    if (!data.length) return

    const { radius = 20, blur = 15 } = this.options

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = ctx.canvas.width
    tempCanvas.height = ctx.canvas.height
    const tempCtx = tempCanvas.getContext('2d')

    data.forEach((eq) => {
      const point = map.latLngToContainerPoint([eq.lat, eq.lng])
      const r = radius + eq.magnitude * 3
      const gradient = tempCtx.createRadialGradient(point.x, point.y, 0, point.x, point.y, r)
      gradient.addColorStop(0, 'rgba(0,0,0,1)')
      gradient.addColorStop(1, 'rgba(0,0,0,0)')
      const alpha = Math.min(eq.magnitude / 8, 1)
      tempCtx.fillStyle = gradient
      tempCtx.globalAlpha = alpha
      tempCtx.beginPath()
      tempCtx.arc(point.x, point.y, r, 0, Math.PI * 2)
      tempCtx.fill()
    })

    tempCtx.globalAlpha = 1

    const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height)
    const pixels = imageData.data

    const gradientColors = [
      { stop: 0, color: [0, 0, 255] },
      { stop: 0.25, color: [0, 255, 255] },
      { stop: 0.5, color: [0, 255, 0] },
      { stop: 0.75, color: [255, 255, 0] },
      { stop: 1, color: [255, 0, 0] },
    ]

    function getColor(t) {
      t = Math.max(0, Math.min(1, t))
      for (let i = 0; i < gradientColors.length - 1; i++) {
        const a = gradientColors[i]
        const b = gradientColors[i + 1]
        if (t >= a.stop && t <= b.stop) {
          const f = (t - a.stop) / (b.stop - a.stop)
          return [
            Math.round(a.color[0] + (b.color[0] - a.color[0]) * f),
            Math.round(a.color[1] + (b.color[1] - a.color[1]) * f),
            Math.round(a.color[2] + (b.color[2] - a.color[2]) * f),
          ]
        }
      }
      return gradientColors[gradientColors.length - 1].color
    }

    for (let i = 0; i < pixels.length; i += 4) {
      const alpha = pixels[i + 3]
      if (alpha > 0) {
        const intensity = alpha / 255
        const [r, g, b] = getColor(intensity)
        pixels[i] = r
        pixels[i + 1] = g
        pixels[i + 2] = b
        pixels[i + 3] = Math.min(alpha * 1.5, 255)
      }
    }

    ctx.putImageData(imageData, 0, 0)
  },
})

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

const ANNOTATION_PROVIDERS = {
  tianditu_vec: { layer: 'cva' },
  tianditu_img: { layer: 'cia' },
  tianditu_ter: { layer: 'cta' },
}

function makeAnnotationUrl(basemapId) {
  const cfg = BASEMAP_PROVIDERS[basemapId]
  const ann = ANNOTATION_PROVIDERS[basemapId]
  if (!cfg || !ann) return null
  return `https://t0.tianditu.gov.cn/${ann.layer}_w/wmts?tk=${TIANDITU_TOKEN}&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=${ann.layer}&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}`
}

function createBasemapLayers(basemapId) {
  const cfg = BASEMAP_PROVIDERS[basemapId]
  const base = cfg
    ? L.tileLayer(cfg.url, { attribution: cfg.attribution, maxZoom: cfg.maxZoom || 18 })
    : L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19,
      })

  const annUrl = makeAnnotationUrl(basemapId)
  const annotation = annUrl
    ? L.tileLayer(annUrl, { attribution: cfg.attribution, maxZoom: cfg.maxZoom || 18 })
    : null

  return { base, annotation }
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
  const earthquakeHeatmapRef = useRef(null)
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

      const { base: basemapLayer, annotation: annLayer } = createBasemapLayers(currentBasemap)
      basemapLayer.addTo(map)
      if (annLayer) annLayer.addTo(map)
      basemapLayerRef.current = { base: basemapLayer, annotation: annLayer }

      hexGroupRef.current = L.layerGroup().addTo(map)
      const heatmap = new HeatmapCanvas({ radius: 20, blur: 15 }).addTo(map)
      earthquakeHeatmapRef.current = heatmap
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

    const old = basemapLayerRef.current
    if (old) {
      if (old.base) map.removeLayer(old.base)
      if (old.annotation) map.removeLayer(old.annotation)
    }

    const { base, annotation } = createBasemapLayers(currentBasemap)
    base.addTo(map)
    if (annotation) annotation.addTo(map)
    basemapLayerRef.current = { base, annotation }
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
    const heatmap = earthquakeHeatmapRef.current
    if (!heatmap) return
    heatmap.setData(earthquakeVisible ? earthquakeData : [])
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
