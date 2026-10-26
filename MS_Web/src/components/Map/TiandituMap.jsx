import { useEffect, useRef, useState, useCallback } from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'
import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import WMTS from 'ol/source/WMTS'
import WMTSTileGrid from 'ol/tilegrid/WMTS'
import { get as getProjection } from 'ol/proj'
import { getWidth as getExtentWidth } from 'ol/extent'
import { fromLonLat } from 'ol/proj'
import ScaleLine from 'ol/control/ScaleLine'
import Zoom from 'ol/control/Zoom'
import Attribution from 'ol/control/Attribution'
import { TIANDITU_TOKEN, TIANDITU_BASEMAPS } from './tiandituBasemaps'

function tiandituUrl(layerKey) {
  return `https://t0.tianditu.gov.cn/${layerKey}_w/wmts?tk=${TIANDITU_TOKEN}`
}

function createWMTSLayer(layerKey, maxLevel) {
  const projection = getProjection('EPSG:3857')
  const size = getExtentWidth(projection.getExtent()) / 256
  const levels = maxLevel + 1
  const resolutions = new Array(levels)
  const matrixIds = new Array(levels)
  for (let z = 0; z < levels; z++) {
    resolutions[z] = size / Math.pow(2, z)
    matrixIds[z] = z
  }

  return new TileLayer({
    source: new WMTS({
      url: tiandituUrl(layerKey),
      layer: layerKey,
      matrixSet: 'w',
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
      attributions: '© 国家地理信息公共服务平台 天地图 GS(2024)0568号',
    }),
  })
}

function createBasemapLayers(basemapKey, annotationVisible) {
  const cfg = TIANDITU_BASEMAPS[basemapKey] || TIANDITU_BASEMAPS.vec
  const base = createWMTSLayer(cfg.layer, cfg.maxLevel)
  const annotation = annotationVisible ? createWMTSLayer(cfg.annotation, cfg.maxLevel) : null
  return { base, annotation }
}

export default function TiandituMap({
  basemap = 'vec',
  annotationVisible = true,
  center = [108, 35],
  zoom = 5,
}) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const layersRef = useRef({ base: null, annotation: null })
  const firstSwapRef = useRef(true)
  const [loading, setLoading] = useState(true)
  const missingToken = !TIANDITU_TOKEN

  const initMap = useCallback(() => {
    const el = containerRef.current
    if (!el) return

    const { base, annotation } = createBasemapLayers(basemap, annotationVisible)
    layersRef.current = { base, annotation }

    const map = new Map({
      target: el,
      layers: [base, annotation].filter(Boolean),
      view: new View({
        center: fromLonLat(center),
        zoom,
        maxZoom: 18,
      }),
      controls: [new ScaleLine({ units: 'metric' }), new Zoom(), new Attribution()],
    })

    map.on('loadend', () => setLoading(false))
    mapRef.current = map
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const swapBasemap = useCallback((key, withAnnotation) => {
    const map = mapRef.current
    if (!map) return
    const { base, annotation } = createBasemapLayers(key, withAnnotation)
    const prev = layersRef.current
    if (prev.base) map.getLayers().remove(prev.base)
    if (prev.annotation) map.getLayers().remove(prev.annotation)
    map.getLayers().insertAt(0, base)
    if (annotation) map.getLayers().insertAt(1, annotation)
    layersRef.current = { base, annotation }
  }, [])

  useEffect(() => {
    if (missingToken) return
    initMap()
    return () => {
      const map = mapRef.current
      if (!map) return
      map.setTarget(undefined)
      map.dispose()
      mapRef.current = null
      layersRef.current = { base: null, annotation: null }
    }
  }, [initMap, missingToken])

  useEffect(() => {
    // initMap 已按当前 basemap/annotationVisible 建好图层，首次运行无需重建
    if (firstSwapRef.current) {
      firstSwapRef.current = false
      return
    }
    swapBasemap(basemap, annotationVisible)
  }, [basemap, annotationVisible, swapBasemap])

  if (missingToken) {
    return (
      <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.paper' }}>
        <Typography color="error">未配置 VITE_TIANDITU_TOKEN，天地图瓦片无法加载</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative', bgcolor: '#0b1a2b' }}>
      <Box ref={containerRef} sx={{ width: '100%', height: '100%' }} />
      {loading && (
        <Box
          sx={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 1, bgcolor: 'rgba(0,0,0,0.35)', zIndex: 5,
          }}
        >
          <CircularProgress size={32} />
          <Typography variant="body2" sx={{ color: 'white' }}>天地图加载中…</Typography>
        </Box>
      )}
    </Box>
  )
}
