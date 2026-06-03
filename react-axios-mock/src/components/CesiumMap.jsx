import { useEffect, useRef, useState } from 'react'
import * as Cesium from 'cesium'
import { Box, CircularProgress, Typography } from '@mui/material'
import { getCities } from '../api/cesium'

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiYjM0OTdiZi0yN2EzLTRkNmItODlkZC1iNGQyZWNjODk1MjkiLCJpZCI6NTc3NjQsInN1YiI6IuaEpOaAkueahOmYv-aWhyIsImlzcyI6Imh0dHBzOi8vaW9uLmNlc2l1bS5jb20iLCJhdWQiOiJhcHAyIiwiaWF0IjoxNzc4ODIxOTk4fQ.HTtyOKV1KT7CNZypQcaqPJYQAYCpaInCh0NwfbctEng'

Cesium.Resource.supportsImageBitmapOptions = function () {
  return Promise.resolve(false)
}

const TIANDITU_TOKEN = import.meta.env.VITE_TIANDITU_TOKEN || ''

const BASEMAP_PROVIDERS = {
  tianditu_vec: {
    base: new Cesium.WebMapTileServiceImageryProvider({
      url: `/tianditu/vec_w/wmts?tk=${TIANDITU_TOKEN}`,
      layer: 'vec', style: 'default', format: 'tiles', tileMatrixSetID: 'w', maximumLevel: 18,
    }),
    annotation: new Cesium.WebMapTileServiceImageryProvider({
      url: `/tianditu/cva_w/wmts?tk=${TIANDITU_TOKEN}`,
      layer: 'cva', style: 'default', format: 'tiles', tileMatrixSetID: 'w', maximumLevel: 18,
    }),
  },
  tianditu_img: {
    base: new Cesium.WebMapTileServiceImageryProvider({
      url: `/tianditu/img_w/wmts?tk=${TIANDITU_TOKEN}`,
      layer: 'img', style: 'default', format: 'tiles', tileMatrixSetID: 'w', maximumLevel: 18,
    }),
    annotation: new Cesium.WebMapTileServiceImageryProvider({
      url: `/tianditu/cia_w/wmts?tk=${TIANDITU_TOKEN}`,
      layer: 'cia', style: 'default', format: 'tiles', tileMatrixSetID: 'w', maximumLevel: 18,
    }),
  },
  tianditu_ter: {
    base: new Cesium.WebMapTileServiceImageryProvider({
      url: `/tianditu/ter_w/wmts?tk=${TIANDITU_TOKEN}`,
      layer: 'ter', style: 'default', format: 'tiles', tileMatrixSetID: 'w', maximumLevel: 14,
    }),
    annotation: new Cesium.WebMapTileServiceImageryProvider({
      url: `/tianditu/cta_w/wmts?tk=${TIANDITU_TOKEN}`,
      layer: 'cta', style: 'default', format: 'tiles', tileMatrixSetID: 'w', maximumLevel: 14,
    }),
  },
  amap_vec: {
    base: new Cesium.UrlTemplateImageryProvider({
      url: 'https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
      minimumLevel: 1, maximumLevel: 18,
    }),
  },
  amap_img: {
    base: new Cesium.UrlTemplateImageryProvider({
      url: 'https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
      minimumLevel: 1, maximumLevel: 18,
    }),
  },
  baidu_traffic: {
    base: new Cesium.UrlTemplateImageryProvider({
      url: '/baidu/traffic/TrafficTileService?level={z}&x={x}&y={y}&label=web2&v=017&scaler=2',
      minimumLevel: 1, maximumLevel: 18,
    }),
  },
}

function createCustomImageryProvider(layer) {
  const alpha = layer.opacity ?? 1.0
  switch (layer.type) {
    case 'wms': {
      const provider = new Cesium.WebMapServiceImageryProvider({
        url: layer.url,
        layers: layer.layers,
        parameters: {
          format: layer.format || 'image/png',
          transparent: layer.transparent !== false,
        },
        enablePickFeatures: false,
      })
      return { provider, alpha }
    }
    case 'wmts': {
      const provider = new Cesium.WebMapTileServiceImageryProvider({
        url: layer.url,
        layer: layer.layer,
        style: layer.style || 'default',
        format: layer.format || 'image/png',
        tileMatrixSetID: layer.tileMatrixSetID || 'w',
        maximumLevel: layer.maxLevel || 18,
      })
      return { provider, alpha }
    }
    case 'xyz': {
      const provider = new Cesium.UrlTemplateImageryProvider({
        url: layer.url,
        maximumLevel: layer.maxLevel || 18,
      })
      return { provider, alpha }
    }
    default:
      return null
  }
}

export default function CesiumMap({
  currentBasemap = 'tianditu_vec',
  bimModels = [],
  onBimLoad = null,
  hexGridCells = [],
  hexGridVisible = false,
  hexGridOpacity = 0.6,
  customLayers = [],
}) {
  const containerRef = useRef(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const viewerRef = useRef(null)
  const bimEntitiesRef = useRef({})
  const hexEntitiesRef = useRef([])
  const customImageryRef = useRef({})

  const addBasemapLayer = (viewer, basemapId) => {
    const provider = BASEMAP_PROVIDERS[basemapId]
    if (!provider) return
    viewer.imageryLayers.removeAll()
    if (provider.base) viewer.imageryLayers.addImageryProvider(provider.base)
    if (provider.annotation) viewer.imageryLayers.addImageryProvider(provider.annotation)
  }

  const changeBasemap = (basemapId) => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed()) return
    const provider = BASEMAP_PROVIDERS[basemapId]
    if (!provider) return
    viewer.imageryLayers.removeAll(false)
    if (provider.base) viewer.imageryLayers.addImageryProvider(provider.base)
    if (provider.annotation) viewer.imageryLayers.addImageryProvider(provider.annotation)
    addActiveCustomLayers(viewer)
  }

  const addActiveCustomLayers = (viewer) => {
    const active = customLayers.filter((l) => l.visible)
    active.forEach((layer) => {
      const result = createCustomImageryProvider(layer)
      if (!result) return
      const { provider, alpha } = result
      const imageryLayer = viewer.imageryLayers.addImageryProvider(provider)
      imageryLayer.alpha = alpha
      customImageryRef.current[layer.id] = imageryLayer
    })
  }

  useEffect(() => {
    let cancelled = false
    let viewer

    async function init() {
      try {
        const el = containerRef.current
        if (!el) return

        viewer = new Cesium.Viewer(el, {
          animation: false, timeline: false, geocoder: false,
          homeButton: false, sceneModePicker: false, baseLayerPicker: false,
          navigationHelpButton: false, infoBox: false,
        })

        viewerRef.current = viewer
        viewer.imageryLayers.removeAll()
        addBasemapLayer(viewer, currentBasemap)

        viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(108, 35, 6000000),
        })

        const res = await getCities()
        if (cancelled || !viewer || viewer.isDestroyed()) return

        const data = res.data
        if (data) {
          data.forEach((city) => {
            viewer.entities.add({
              position: Cesium.Cartesian3.fromDegrees(city.lng, city.lat),
              point: {
                color: Cesium.Color.DODGERBLUE,
                pixelSize: 10,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 2,
                scaleByDistance: new Cesium.NearFarScalar(1.5e6, 1.0, 1.5e7, 0.3),
              },
              label: {
                text: city.name,
                font: '14px sans-serif',
                fillColor: Cesium.Color.WHITE,
                showBackground: true,
                backgroundColor: Cesium.Color.BLACK.withAlpha(0.6),
                pixelOffset: { x: 0, y: -20 },
              },
            })
          })
        }
      } catch (err) {
        console.error('Cesium init error:', err)
        if (!cancelled) setError(err.message || 'Failed to initialize map')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    init()

    return () => {
      cancelled = true
      if (viewer && !viewer.isDestroyed()) viewer.destroy()
    }
  }, [])

  useEffect(() => {
    if (viewerRef.current && !viewerRef.current.isDestroyed()) {
      changeBasemap(currentBasemap)
    }
  }, [currentBasemap])

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed()) return

    Object.values(customImageryRef.current).forEach((il) => {
      viewer.imageryLayers.remove(il, false)
    })
    customImageryRef.current = {}

    const active = customLayers.filter((l) => l.visible)
    active.forEach((layer) => {
      const result = createCustomImageryProvider(layer)
      if (!result) return
      const { provider, alpha } = result
      const imageryLayer = viewer.imageryLayers.addImageryProvider(provider)
      imageryLayer.alpha = alpha
      customImageryRef.current[layer.id] = imageryLayer
    })
  }, [customLayers])

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed()) return

    hexEntitiesRef.current.forEach((e) => viewer.entities.remove(e))
    hexEntitiesRef.current = []

    if (!hexGridVisible || !hexGridCells.length) return

    const hexColor = Cesium.Color.fromCssColorString('#4a90e2').withAlpha(hexGridOpacity)
    const outlineColor = Cesium.Color.fromCssColorString('#2a6ab0').withAlpha(hexGridOpacity + 0.2)

    hexGridCells.forEach((cell) => {
      const positions = cell.vertices.map((v) =>
        Cesium.Cartesian3.fromDegrees(v.lng, v.lat)
      )
      if (positions.length < 3) return

      const entity = viewer.entities.add({
        id: cell.id,
        polygon: {
          hierarchy: new Cesium.PolygonHierarchy(positions),
          material: hexColor,
          outline: true,
          outlineColor,
          outlineWidth: 1,
        },
      })
      hexEntitiesRef.current.push(entity)
    })
  }, [hexGridCells, hexGridVisible, hexGridOpacity])

  const loadBIMModel = async (viewer, bimModel) => {
    try {
      const position = Cesium.Cartesian3.fromDegrees(
        bimModel.position.lng, bimModel.position.lat, bimModel.position.height
      )
      const entity = viewer.entities.add({
        id: bimModel.id,
        name: bimModel.name,
        description: `
          <div style="padding: 10px;">
            <h3>${bimModel.name}</h3>
            <p><strong>类型:</strong> ${bimModel.type}</p>
            <p><strong>描述:</strong> ${bimModel.description}</p>
            <p><strong>状态:</strong> ${bimModel.status === 'active' ? '已激活' : '处理中'}</p>
            <p><strong>进度:</strong> ${bimModel.progress}%</p>
          </div>
        `,
        position,
        point: {
          pixelSize: 15,
          color: Cesium.Color.fromCssColorString(bimModel.status === 'active' ? '#00ff00' : '#ffaa00'),
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2,
          heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
        },
        label: {
          text: bimModel.name,
          font: '14px sans-serif',
          fillColor: Cesium.Color.WHITE,
          showBackground: true,
          backgroundColor: Cesium.Color.BLACK.withAlpha(0.7),
          pixelOffset: { x: 0, y: -20 },
          heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
        },
        box: {
          dimensions: new Cesium.Cartesian3(100, 100, 50),
          material: Cesium.Color.fromCssColorString(
            bimModel.type === 'building' ? '#4a90e2'
            : bimModel.type === 'bridge' ? '#f5a623'
            : bimModel.type === 'tunnel' ? '#7ed321'
            : bimModel.type === 'facility' ? '#bd10e0'
            : bimModel.type === 'pipeline' ? '#50e3c2' : '#9b9b9b'
          ).withAlpha(0.8),
          outline: true,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2,
          heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
        },
      })
      bimEntitiesRef.current[bimModel.id] = entity
      if (onBimLoad) onBimLoad(bimModel.id, true)
    } catch (error) {
      console.error('Failed to load BIM model:', error)
      if (onBimLoad) onBimLoad(bimModel.id, false, error.message)
    }
  }

  const clearAllBIMModels = (viewer) => {
    Object.keys(bimEntitiesRef.current).forEach((id) => {
      const entity = bimEntitiesRef.current[id]
      if (entity) viewer.entities.remove(entity)
    })
    bimEntitiesRef.current = {}
  }

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed()) return
    clearAllBIMModels(viewer)
    bimModels.forEach((bimModel) => loadBIMModel(viewer, bimModel))
  }, [bimModels])

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed()) return

    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    handler.setInputAction((click) => {
      const pickedObject = viewer.scene.pick(click.position)
      if (Cesium.defined(pickedObject) && pickedObject.id instanceof Cesium.Entity) {
        const entity = pickedObject.id
        if (entity.id && bimEntitiesRef.current[entity.id]) {
          viewer.flyTo(entity, {
            duration: 2,
            offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-45), 500),
          })
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    return () => handler.destroy()
  }, [])

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
