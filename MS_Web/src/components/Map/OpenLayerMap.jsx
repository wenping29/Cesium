import { useEffect, useRef, useState, useCallback } from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import HeatmapLayer from 'ol/layer/Heatmap'
import XYZ from 'ol/source/XYZ'
import TileWMS from 'ol/source/TileWMS'
import VectorSource from 'ol/source/Vector'
import WMTS from 'ol/source/WMTS'
import WMTSTileGrid from 'ol/tilegrid/WMTS'
import { get as getProjection } from 'ol/proj'
import { getWidth as getExtentWidth } from 'ol/extent'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import Polygon from 'ol/geom/Polygon'
import LineString from 'ol/geom/LineString'
import Style from 'ol/style/Style'
import CircleStyle from 'ol/style/Circle'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'
import Text from 'ol/style/Text'
import RegularShape from 'ol/style/RegularShape'
import Overlay from 'ol/Overlay'
import { fromLonLat } from 'ol/proj'
import { getCities } from '../../api/cesium'

const TIANDITU_TOKEN = import.meta.env.VITE_TIANDITU_TOKEN || ''

const BASEMAP_PROVIDERS = {
  tianditu_vec: {
    url: `https://t0.tianditu.gov.cn/vec_w/wmts?tk=${TIANDITU_TOKEN}`,
    layer: 'vec',
    matrixSet: 'w',
    format: 'tiles',
    style: 'default',
  },
  tianditu_img: {
    url: `https://t0.tianditu.gov.cn/img_w/wmts?tk=${TIANDITU_TOKEN}`,
    layer: 'img',
    matrixSet: 'w',
    format: 'tiles',
    style: 'default',
  },
  tianditu_ter: {
    url: `https://t0.tianditu.gov.cn/ter_w/wmts?tk=${TIANDITU_TOKEN}`,
    layer: 'ter',
    matrixSet: 'w',
    format: 'tiles',
    style: 'default',
  },
  amap_vec: {
    url: 'https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
    type: 'xyz',
  },
  amap_img: {
    url: 'https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
    type: 'xyz',
  },
}

const ANNOTATION_PROVIDERS = {
  tianditu_vec: { layer: 'cva', matrixSet: 'w' },
  tianditu_img: { layer: 'cia', matrixSet: 'w' },
  tianditu_ter: { layer: 'cta', matrixSet: 'w' },
}

function createTileLayer(cfg, url) {
  return new TileLayer({
    source: new XYZ({ url: url || cfg.url, maxZoom: 18 }),
  })
}

function createWMTSLayer(url, layer, matrixSet) {
  const projection = getProjection('EPSG:3857')
  const projectionExtent = projection.getExtent()
  const size = getExtentWidth(projectionExtent) / 256
  const resolutions = new Array(19)
  const matrixIds = new Array(19)
  for (let z = 0; z < 19; z++) {
    resolutions[z] = size / Math.pow(2, z)
    matrixIds[z] = z
  }
  return new TileLayer({
    source: new WMTS({
      url,
      layer,
      matrixSet,
      format: 'tiles',
      style: 'default',
      projection,
      tileGrid: new WMTSTileGrid({
        origin: [-20037508.342789244, 20037508.342789244],
        resolutions,
        matrixIds,
        tileSize: [256, 256],
      }),
      wrapX: true,
    }),
  })
}

function createBasemapLayers(basemapId) {
  const cfg = BASEMAP_PROVIDERS[basemapId]
  if (!cfg) return { base: null, annotation: null }

  let base
  if (cfg.type === 'xyz') {
    base = createTileLayer(cfg)
  } else {
    base = createWMTSLayer(cfg.url, cfg.layer, cfg.matrixSet)
  }

  let annotation = null
  const annCfg = ANNOTATION_PROVIDERS[basemapId]
  if (annCfg) {
    const annUrl = cfg.url.replace(`${cfg.layer}_w`, `${annCfg.layer}_w`)
    annotation = createWMTSLayer(annUrl, annCfg.layer, annCfg.matrixSet)
  }

  return { base, annotation }
}

function createCustomLayer(layer) {
  const alpha = layer.opacity ?? 1.0
  switch (layer.type) {
    case 'wms':
      return new TileLayer({
        source: new TileWMS({
          url: layer.url,
          params: {
            LAYERS: layer.layers,
            FORMAT: layer.format || 'image/png',
            TRANSPARENT: layer.transparent !== false,
          },
        }),
        opacity: alpha,
      })
    case 'wmts': {
      const projection = getProjection('EPSG:3857')
      const projectionExtent = projection.getExtent()
      const size = getExtentWidth(projectionExtent) / 256
      const resolutions = new Array(19)
      const matrixIds = new Array(19)
      for (let z = 0; z < 19; z++) {
        resolutions[z] = size / Math.pow(2, z)
        matrixIds[z] = z
      }
      return new TileLayer({
        source: new WMTS({
          url: layer.url,
          layer: layer.layer || layer.layers,
          matrixSet: layer.tileMatrixSetID || 'w',
          format: layer.format || 'image/png',
          style: layer.style || 'default',
          projection,
          tileGrid: new WMTSTileGrid({
            origin: [-20037508.342789244, 20037508.342789244],
            resolutions,
            matrixIds,
            tileSize: [256, 256],
          }),
          wrapX: true,
        }),
        opacity: alpha,
      })
    }
    case 'xyz':
      return new TileLayer({
        source: new XYZ({ url: layer.url, maxZoom: layer.maxLevel || 18 }),
        opacity: alpha,
      })
    default:
      return null
  }
}


function getWindSpeedColor(speed) {
  if (speed < 5) return '#4caf50'
  if (speed < 10) return '#ff9800'
  return '#f44336'
}

export default function OpenLayerMap({
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
  const popupRef = useRef(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const mapRef = useRef(null)
  const overlayRef = useRef(null)
  const basemapLayerRef = useRef(null)
  const cityLayerRef = useRef(null)
  const customLayerRefs = useRef({})
  const hexLayerRef = useRef(null)
  const earthquakeLayerRef = useRef(null)
  const typhoonLayerRef = useRef(null)
  const windLayerRef = useRef(null)

  const initMap = useCallback(() => {
    const el = containerRef.current
    if (!el) return

    try {
      const { base: basemapLayer, annotation: annLayer } = createBasemapLayers(currentBasemap)
      basemapLayerRef.current = { base: basemapLayer, annotation: annLayer }

      const vectorSource = new VectorSource()
      const vectorLayer = new VectorLayer({ source: vectorSource })
      cityLayerRef.current = { layer: vectorLayer, source: vectorSource }

      const hexSource = new VectorSource()
      const hexLayer = new VectorLayer({
        source: hexSource,
        style: () => new Style({
          fill: new Fill({ color: `rgba(74, 144, 226, ${hexGridOpacity})` }),
          stroke: new Stroke({ color: `rgba(42, 106, 176, ${Math.min(hexGridOpacity + 0.2, 1)})`, width: 1 }),
        }),
      })
      hexLayerRef.current = { layer: hexLayer, source: hexSource }

      const earthquakeSource = new VectorSource()
      const earthquakeLayer = new HeatmapLayer({
        source: earthquakeSource,
        blur: 20,
        radius: 12,
        gradient: ['#00f', '#0ff', '#0f0', '#ff0', '#f00'],
      })
      earthquakeLayerRef.current = { layer: earthquakeLayer, source: earthquakeSource }

      const typhoonSource = new VectorSource()
      const typhoonLayer = new VectorLayer({ source: typhoonSource })
      typhoonLayerRef.current = { layer: typhoonLayer, source: typhoonSource }

      const windSource = new VectorSource()
      const windLayer = new VectorLayer({ source: windSource })
      windLayerRef.current = { layer: windLayer, source: windSource }

      const overlay = new Overlay({
        element: popupRef.current,
        positioning: 'bottom-center',
        offset: [0, -10],
        autoPan: true,
      })
      overlayRef.current = overlay

      const map = new Map({
        target: el,
        layers: [basemapLayer, annLayer, vectorLayer, hexLayer, earthquakeLayer, typhoonLayer, windLayer].filter(Boolean),
        view: new View({
          center: fromLonLat([108, 35]),
          zoom: 5,
          maxZoom: 18,
        }),
        overlays: [overlay],
      })

      map.on('click', (evt) => {
        const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f)
        if (feature) {
          const props = feature.getProperties()
          const popupEl = popupRef.current
          if (popupEl) {
            popupEl.innerHTML = props.popupContent || props.name || ''
            overlayRef.current.setPosition(evt.coordinate)
          }
        } else {
          overlayRef.current.setPosition(undefined)
        }
      })

      mapRef.current = map
      return map
    } catch (err) {
      console.error('OpenLayers init error:', err)
      setError(err.message || 'Failed to initialize map')
      return null
    }
  }, [currentBasemap, hexGridOpacity])

  const addCityMarkers = useCallback(async (map) => {
    if (!map) return
    const { layer, source } = cityLayerRef.current
    if (!source) return

    source.clear()
    if (!map.getLayers().getArray().includes(layer)) {
      map.addLayer(layer)
    }

    try {
      // const res = await getCities()
      // const data = res.data
      // if (data) {
      //   const features = data.map((city) => {
      //     const feature = new Feature({
      //       geometry: new Point(fromLonLat([city.lng, city.lat])),
      //       name: city.name,
      //       popupContent: `<div style="padding:8px"><strong>${city.name}</strong></div>`,
      //     })
      //     feature.setStyle(new Style({
      //       image: new CircleStyle({
      //         radius: 6,
      //         fill: new Fill({ color: '#1e90ff' }),
      //         stroke: new Stroke({ color: '#fff', width: 2 }),
      //       }),
      //       text: new Text({
      //         text: city.name,
      //         font: '14px sans-serif',
      //         fill: new Fill({ color: '#fff' }),
      //         backgroundFill: new Fill({ color: 'rgba(0,0,0,0.6)' }),
      //         offsetY: -18,
      //       }),
      //     }))
      //     return feature
      //   })
      //   source.addFeatures(features)
      // }
    } catch (err) {
      console.error('Failed to load cities:', err)
    }
  }, [])

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
        mapRef.current.setTarget(undefined)
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
    basemapLayerRef.current = { base, annotation }
    if (base) {
      map.getLayers().insertAt(0, base)
      if (annotation) map.getLayers().insertAt(1, annotation)
    }
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
      const olLayer = createCustomLayer(layer)
      if (olLayer) {
        map.addLayer(olLayer)
        olLayer.setZIndex(100)
        customLayerRefs.current[layer.id] = olLayer
      }
    })
  }, [customLayers])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const { source } = hexLayerRef.current
    source.clear()

    if (!hexGridVisible || !hexGridCells.length) return

    const features = hexGridCells.map((cell) => {
      const coords = cell.vertices.map((v) => fromLonLat([v.lng, v.lat]))
      coords.push(coords[0])
      const feature = new Feature({
        geometry: new Polygon([coords]),
        id: cell.id,
      })
      return feature
    })
    source.addFeatures(features)
  }, [hexGridCells, hexGridVisible, hexGridOpacity])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const { source } = earthquakeLayerRef.current
    source.clear()

    if (!earthquakeVisible || !earthquakeData.length) return

    const features = earthquakeData.map((eq) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([eq.lng, eq.lat])),
        weight: Math.min(eq.magnitude / 10, 1),
        magnitude: eq.magnitude,
        region: eq.region,
        depth: eq.depth,
        time: eq.time,
        description: eq.description || '',
        popupContent: `
          <div style="padding:10px;min-width:200px">
            <h3 style="margin:0 0 8px">${eq.region}</h3>
            <p><strong>Magnitude:</strong> ${eq.magnitude}</p>
            <p><strong>Depth:</strong> ${eq.depth} km</p>
            <p><strong>Time:</strong> ${eq.time}</p>
            <p>${eq.description || ''}</p>
          </div>
        `,
        id: `earthquake-${eq.id}`,
      })
      return feature
    })
    source.addFeatures(features)
  }, [earthquakeData, earthquakeVisible])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !selectedEarthquake || !earthquakeVisible) return

    map.getView().animate({
      center: fromLonLat([selectedEarthquake.lng, selectedEarthquake.lat]),
      zoom: 8,
      duration: 1000,
    })
  }, [selectedEarthquake, earthquakeVisible])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const { source } = typhoonLayerRef.current
    source.clear()

    if (!typhoonVisible) return

    const { current, historical } = typhoonData
    const features = []

    if (current) {
      const pathCoords = (current.path || []).map((p) => fromLonLat([p[0], p[1]]))
      if (pathCoords.length >= 2) {
        const pathFeature = new Feature({
          geometry: new LineString(pathCoords),
          name: `${current.name} Path`,
          popupContent: `<div style="padding:8px"><strong>${current.name} Path</strong></div>`,
        })
        pathFeature.setStyle(new Style({
          stroke: new Stroke({ color: '#42a5f5', width: 3 }),
        }))
        features.push(pathFeature)
      }

      const currentFeature = new Feature({
        geometry: new Point(fromLonLat([current.lng, current.lat])),
        name: current.name,
        popupContent: `
          <div style="padding:10px">
            <h3 style="margin:0 0 8px">${current.name}</h3>
            <p><strong>Strength:</strong> ${current.strength}</p>
            <p><strong>Wind Speed:</strong> ${current.windSpeed} m/s</p>
            <p><strong>Pressure:</strong> ${current.pressure} hPa</p>
            <p><strong>Time:</strong> ${current.time}</p>
          </div>
        `,
        id: `typhoon-${current.id}`,
      })
      currentFeature.setStyle(new Style({
        image: new CircleStyle({
          radius: 12,
          fill: new Fill({ color: '#42a5f5' }),
          stroke: new Stroke({ color: '#fff', width: 3 }),
        }),
        text: new Text({
          text: `${current.name} (${current.windSpeed}m/s)`,
          font: '14px sans-serif',
          fill: new Fill({ color: '#42a5f5' }),
          backgroundFill: new Fill({ color: 'rgba(0,0,0,0.6)' }),
          offsetY: -20,
        }),
      }))
      features.push(currentFeature)
    }

    historical.forEach((ty) => {
      const hFeature = new Feature({
        geometry: new Point(fromLonLat([ty.lng, ty.lat])),
        name: ty.name,
        popupContent: `
          <div style="padding:10px">
            <h3 style="margin:0 0 8px">${ty.name}</h3>
            <p><strong>Strength:</strong> ${ty.strength}</p>
            <p><strong>Wind Speed:</strong> ${ty.windSpeed} m/s</p>
            <p><strong>Pressure:</strong> ${ty.pressure} hPa</p>
            <p><strong>Time:</strong> ${ty.time}</p>
          </div>
        `,
        id: `typhoon-${ty.id}`,
      })
      hFeature.setStyle(new Style({
        image: new CircleStyle({
          radius: 6,
          fill: new Fill({ color: 'rgba(66, 165, 245, 0.6)' }),
          stroke: new Stroke({ color: '#fff', width: 1 }),
        }),
        text: new Text({
          text: ty.name,
          font: '12px sans-serif',
          fill: new Fill({ color: 'rgba(66, 165, 245, 0.8)' }),
          backgroundFill: new Fill({ color: 'rgba(0,0,0,0.4)' }),
          offsetY: -14,
        }),
      }))
      features.push(hFeature)
    })

    source.addFeatures(features)
  }, [typhoonData, typhoonVisible])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !selectedTyphoon || !typhoonVisible) return

    map.getView().animate({
      center: fromLonLat([selectedTyphoon.lng, selectedTyphoon.lat]),
      zoom: 7,
      duration: 1000,
    })
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

    const { source } = windLayerRef.current
    source.clear()

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

    const shaft = new RegularShape({
      points: 2,
      radius: 6,
      stroke: new Stroke({ width: 2, color: '#fff' }),
      rotateWithView: true,
    })

    const head = new RegularShape({
      points: 3,
      radius: 6,
      fill: new Fill({ color: '#fff' }),
      rotateWithView: true,
    })

    const arrowStyles = [new Style({ image: shaft }), new Style({ image: head })]

    const features = []

    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        const gridLng = minLng + c * step + step / 2
        const gridLat = minLat + r * step + step / 2
        const { speed, direction } = idwInterpolate(gridLng, gridLat, windData)
        const color = getWindSpeedColor(speed)
        const angle = ((direction - 180) * Math.PI) / 180
        const scale = speed / 10

        shaft.setScale([1, scale])
        shaft.setRotation(angle)
        shaft.setStroke(new Stroke({ width: 2, color }))
        head.setDisplacement([0, head.getRadius() / 2 + shaft.getRadius() * scale])
        head.setRotation(angle)
        head.setFill(new Fill({ color }))

        const arrowFeature = new Feature({
          geometry: new Point(fromLonLat([gridLng, gridLat])),
          speed,
          direction,
        })
        arrowFeature.setStyle(arrowStyles)
        features.push(arrowFeature)
      }
    }

    windData.forEach((w) => {
      const color = getWindSpeedColor(w.speed)
      const feature = new Feature({
        geometry: new Point(fromLonLat([w.lng, w.lat])),
        name: w.region,
        popupContent: `
          <div style="padding:10px">
            <h3 style="margin:0 0 8px">${w.region}</h3>
            <p><strong>Direction:</strong> ${w.direction}°</p>
            <p><strong>Speed:</strong> ${w.speed} m/s</p>
            <p><strong>Gust:</strong> ${w.gust} m/s</p>
          </div>
        `,
        id: `wind-station-${w.id}`,
      })
      feature.setStyle(new Style({
        image: new CircleStyle({
          radius: 8,
          fill: new Fill({ color }),
          stroke: new Stroke({ color: '#fff', width: 2 }),
        }),
        text: new Text({
          text: `${w.region} ${w.speed.toFixed(1)}m/s`,
          font: '12px sans-serif',
          fill: new Fill({ color }),
          backgroundFill: new Fill({ color: 'rgba(0,0,0,0.5)' }),
          offsetY: -16,
        }),
      }))
      features.push(feature)
    })

    source.addFeatures(features)
  }, [windData, windVisible])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !selectedWind || !windVisible) return

    map.getView().animate({
      center: fromLonLat([selectedWind.lng, selectedWind.lat]),
      zoom: 7,
      duration: 1000,
    })
  }, [selectedWind, windVisible])

  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      <div
        ref={popupRef}
        style={{
          position: 'absolute',
          background: 'white',
          borderRadius: 4,
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          padding: 0,
          color: '#333',
          fontSize: 14,
          pointerEvents: 'auto',
          display: 'none',
        }}
      />
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
