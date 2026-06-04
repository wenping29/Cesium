import { useEffect, useRef, useState } from 'react'
import * as Cesium from 'cesium'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { getCities } from '../api/cesium'

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiYjM0OTdiZi0yN2EzLTRkNmItODlkZC1iNGQyZWNjODk1MjkiLCJpZCI6NTc3NjQsInN1YiI6IuaEpOaAkueahOmYv-aWhyIsImlzcyI6Imh0dHBzOi8vaW9uLmNlc2l1bS5jb20iLCJhdWQiOiJhcHAyIiwiaWF0IjoxNzc4ODIxOTk4fQ.HTtyOKV1KT7CNZypQcaqPJYQAYCpaInCh0NwfbctEng'

Cesium.Resource.supportsImageBitmapOptions = function () {
  return Promise.resolve(false)
}

const TIANDITU_TOKEN = import.meta.env.VITE_TIANDITU_TOKEN || ''

const BASEMAP_PROVIDERS = {
  tianditu_vec: {
    base: new Cesium.WebMapTileServiceImageryProvider({
      url: `https://t0.tianditu.gov.cn/vec_w/wmts?tk=${TIANDITU_TOKEN}`,
      layer: 'vec', style: 'default', format: 'tiles', tileMatrixSetID: 'w', maximumLevel: 18,
    }),
    annotation: new Cesium.WebMapTileServiceImageryProvider({
      url: `https://t0.tianditu.gov.cn/cva_w/wmts?tk=${TIANDITU_TOKEN}`,
      layer: 'cva', style: 'default', format: 'tiles', tileMatrixSetID: 'w', maximumLevel: 18,
    }),
  },
  tianditu_img: {
    base: new Cesium.WebMapTileServiceImageryProvider({
      url: `https://t0.tianditu.gov.cn/img_w/wmts?tk=${TIANDITU_TOKEN}`,
      layer: 'img', style: 'default', format: 'tiles', tileMatrixSetID: 'w', maximumLevel: 18,
    }),
    annotation: new Cesium.WebMapTileServiceImageryProvider({
      url: `https://t0.tianditu.gov.cn/cia_w/wmts?tk=${TIANDITU_TOKEN}`,
      layer: 'cia', style: 'default', format: 'tiles', tileMatrixSetID: 'w', maximumLevel: 18,
    }),
  },
  tianditu_ter: {
    base: new Cesium.WebMapTileServiceImageryProvider({
      url: `https://t0.tianditu.gov.cn/ter_w/wmts?tk=${TIANDITU_TOKEN}`,
      layer: 'ter', style: 'default', format: 'tiles', tileMatrixSetID: 'w', maximumLevel: 14,
    }),
    annotation: new Cesium.WebMapTileServiceImageryProvider({
      url: `https://t0.tianditu.gov.cn/cta_w/wmts?tk=${TIANDITU_TOKEN}`,
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
      url: 'https://its.map.baidu.com/traffic/TrafficTileService?level={z}&x={x}&y={y}&label=web2&v=017&scaler=2',
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
  sceneMode = '3d',
  bimModels = [],
  onBimLoad = null,
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
  const { t } = useTranslation()
  const containerRef = useRef(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const viewerRef = useRef(null)
  const bimEntitiesRef = useRef({})
  const hexEntitiesRef = useRef([])
  const customImageryRef = useRef({})
  const earthquakeEntitiesRef = useRef([])
  const typhoonEntitiesRef = useRef([])
  const windEntitiesRef = useRef([])

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
    if (sceneMode === '2d') {
      viewer.scene.morphTo2D(2)
    } else {
      viewer.scene.morphTo3D(2)
    }
  }, [sceneMode])

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

  function getMagnitudeColor(mag) {
    if (mag < 3) return Cesium.Color.fromCssColorString('#4caf50')
    if (mag < 5) return Cesium.Color.fromCssColorString('#ff9800')
    if (mag < 7) return Cesium.Color.fromCssColorString('#f44336')
    return Cesium.Color.fromCssColorString('#9c27b0')
  }

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed()) return

    earthquakeEntitiesRef.current.forEach((e) => viewer.entities.remove(e))
    earthquakeEntitiesRef.current = []

    if (!earthquakeVisible || !earthquakeData.length) return

    earthquakeData.forEach((eq) => {
      const color = getMagnitudeColor(eq.magnitude)
      const entity = viewer.entities.add({
        id: `earthquake-${eq.id}`,
        name: `M${eq.magnitude} - ${eq.region}`,
        description: `
          <div style="padding:10px">
            <h3>${eq.region}</h3>
            <p><strong>Magnitude:</strong> ${eq.magnitude}</p>
            <p><strong>Depth:</strong> ${eq.depth} km</p>
            <p><strong>Time:</strong> ${eq.time}</p>
            <p><strong>Region:</strong> ${eq.region}</p>
            <p>${eq.description || ''}</p>
          </div>
        `,
        position: Cesium.Cartesian3.fromDegrees(eq.lng, eq.lat),
        point: {
          color,
          pixelSize: Math.max(8, eq.magnitude * 3),
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2,
          scaleByDistance: new Cesium.NearFarScalar(1.5e6, 1.0, 1.5e7, 0.3),
          heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
        },
        label: {
          text: `M${eq.magnitude.toFixed(1)}`,
          font: '12px sans-serif',
          fillColor: color,
          showBackground: true,
          backgroundColor: Cesium.Color.BLACK.withAlpha(0.5),
          pixelOffset: { x: 0, y: -16 },
          heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
        },
      })
      earthquakeEntitiesRef.current.push(entity)
    })
  }, [earthquakeData, earthquakeVisible])

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed() || !selectedEarthquake || !earthquakeVisible) return

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(selectedEarthquake.lng, selectedEarthquake.lat, 200000),
      duration: 2,
    })
  }, [selectedEarthquake])

  const typhoonColor = Cesium.Color.fromCssColorString('#42a5f5')
  const typhoonPathColor = Cesium.Color.fromCssColorString('#42a5f5').withAlpha(0.6)

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed()) return

    typhoonEntitiesRef.current.forEach((e) => viewer.entities.remove(e))
    typhoonEntitiesRef.current = []

    if (!typhoonVisible) return

    const { current, historical } = typhoonData

    if (current) {
      const pathPositions = (current.path || []).map((p) =>
        Cesium.Cartesian3.fromDegrees(p[0], p[1], 0)
      )

      if (pathPositions.length >= 2) {
        const pathEntity = viewer.entities.add({
          id: `typhoon-path-${current.id}`,
          polyline: {
            positions: pathPositions,
            width: 3,
            material: typhoonPathColor,
            arcType: Cesium.ArcType.GEODESIC,
          },
        })
        typhoonEntitiesRef.current.push(pathEntity)
      }

      const currentEntity = viewer.entities.add({
        id: `typhoon-${current.id}`,
        name: current.name,
        description: `
          <div style="padding:10px">
            <h3>${current.name}</h3>
            <p><strong>Strength:</strong> ${current.strength}</p>
            <p><strong>Wind Speed:</strong> ${current.windSpeed} m/s</p>
            <p><strong>Pressure:</strong> ${current.pressure} hPa</p>
            <p><strong>Time:</strong> ${current.time}</p>
          </div>
        `,
        position: Cesium.Cartesian3.fromDegrees(current.lng, current.lat, 0),
        point: {
          pixelSize: 20,
          color: typhoonColor,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 3,
          scaleByDistance: new Cesium.NearFarScalar(1.5e6, 1.0, 1.5e7, 0.5),
          heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
        },
        label: {
          text: `${current.name} (${current.windSpeed}m/s)`,
          font: '14px sans-serif',
          fillColor: typhoonColor,
          showBackground: true,
          backgroundColor: Cesium.Color.BLACK.withAlpha(0.6),
          pixelOffset: { x: 0, y: -24 },
          heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
        },
      })
      typhoonEntitiesRef.current.push(currentEntity)
    }

    historical.forEach((ty) => {
      const hEntity = viewer.entities.add({
        id: `typhoon-${ty.id}`,
        name: ty.name,
        description: `
          <div style="padding:10px">
            <h3>${ty.name}</h3>
            <p><strong>Strength:</strong> ${ty.strength}</p>
            <p><strong>Wind Speed:</strong> ${ty.windSpeed} m/s</p>
            <p><strong>Pressure:</strong> ${ty.pressure} hPa</p>
            <p><strong>Time:</strong> ${ty.time}</p>
          </div>
        `,
        position: Cesium.Cartesian3.fromDegrees(ty.lng, ty.lat, 0),
        point: {
          pixelSize: 10,
          color: typhoonColor.withAlpha(0.6),
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 1,
          scaleByDistance: new Cesium.NearFarScalar(1.5e6, 1.0, 1.5e7, 0.3),
          heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
        },
        label: {
          text: ty.name,
          font: '12px sans-serif',
          fillColor: typhoonColor.withAlpha(0.8),
          showBackground: true,
          backgroundColor: Cesium.Color.BLACK.withAlpha(0.4),
          pixelOffset: { x: 0, y: -16 },
          heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
        },
      })
      typhoonEntitiesRef.current.push(hEntity)
    })
  }, [typhoonData, typhoonVisible])

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed() || !selectedTyphoon || !typhoonVisible) return

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(selectedTyphoon.lng, selectedTyphoon.lat, 300000),
      duration: 2,
    })
  }, [selectedTyphoon])

  function getWindSpeedColor(speed) {
    if (speed < 5) return Cesium.Color.fromCssColorString('#4caf50')
    if (speed < 10) return Cesium.Color.fromCssColorString('#ff9800')
    return Cesium.Color.fromCssColorString('#f44336')
  }

  function createArrowCanvas() {
    const canvas = document.createElement('canvas')
    canvas.width = 40
    canvas.height = 40
    const ctx = canvas.getContext('2d')
    const cx = 20, cy = 20
    ctx.clearRect(0, 0, 40, 40)
    ctx.beginPath()
    ctx.moveTo(cx, cy - 14)
    ctx.lineTo(cx + 10, cy + 2)
    ctx.lineTo(cx + 3, cy)
    ctx.lineTo(cx + 3, cy + 10)
    ctx.lineTo(cx - 3, cy + 10)
    ctx.lineTo(cx - 3, cy)
    ctx.lineTo(cx - 10, cy + 2)
    ctx.closePath()
    ctx.fillStyle = '#fff'
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.9)'
    ctx.lineWidth = 1
    ctx.stroke()
    return canvas
  }

  const arrowCanvas = createArrowCanvas()

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed()) return

    windEntitiesRef.current.forEach((e) => viewer.entities.remove(e))
    windEntitiesRef.current = []

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

    function idwInterpolate(gridLng, gridLat) {
      let weightedSpeed = 0, weightedCos = 0, weightedSin = 0, totalW = 0
      for (const s of windData) {
        const d = Math.sqrt((s.lng - gridLng) ** 2 + (s.lat - gridLat) ** 2)
        if (d < 0.01) return { speed: s.speed, direction: s.direction }
        const w = 1 / (d * d)
        const rad = Cesium.Math.toRadians(s.direction)
        weightedSpeed += w * s.speed
        weightedCos += w * Math.cos(rad)
        weightedSin += w * Math.sin(rad)
        totalW += w
      }
      return {
        speed: weightedSpeed / totalW,
        direction: (Cesium.Math.toDegrees(Math.atan2(weightedSin, weightedCos)) + 360) % 360,
      }
    }

    const gridEntities = []

    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        const gridLng = minLng + c * step + step / 2
        const gridLat = minLat + r * step + step / 2
        const { speed, direction } = idwInterpolate(gridLng, gridLat)
        const color = getWindSpeedColor(speed)

        const entity = viewer.entities.add({
          id: `wind-grid-${r}-${c}`,
          position: Cesium.Cartesian3.fromDegrees(gridLng, gridLat, 0),
          point: {
            pixelSize: 6,
            color,
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 1,
            heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
          },
          billboard: {
            image: arrowCanvas,
            rotation: -Cesium.Math.toRadians(direction),
            scale: 0.5,
            verticalOrigin: Cesium.VerticalOrigin.CENTER,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
          },
        })
        gridEntities.push(entity)
      }
    }

    windData.forEach((w) => {
      const color = getWindSpeedColor(w.speed)
      const entity = viewer.entities.add({
        id: `wind-station-${w.id}`,
        name: w.region,
        description: `
          <div style="padding:10px">
            <h3>${w.region}</h3>
            <p><strong>Direction:</strong> ${w.direction}°</p>
            <p><strong>Speed:</strong> ${w.speed} m/s</p>
            <p><strong>Gust:</strong> ${w.gust} m/s</p>
          </div>
        `,
        position: Cesium.Cartesian3.fromDegrees(w.lng, w.lat, 0),
        point: {
          pixelSize: 12,
          color,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2,
          heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
        },
        label: {
          text: `${w.region} ${w.speed.toFixed(1)}m/s`,
          font: '12px sans-serif',
          fillColor: color,
          showBackground: true,
          backgroundColor: Cesium.Color.BLACK.withAlpha(0.5),
          pixelOffset: { x: 0, y: -18 },
          heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
        },
      })
      gridEntities.push(entity)
    })

    windEntitiesRef.current = gridEntities
  }, [windData, windVisible])

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed() || !selectedWind || !windVisible) return

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(selectedWind.lng, selectedWind.lat, 500000),
      duration: 2,
    })
  }, [selectedWind])

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
        } else if (String(entity.id).startsWith('earthquake-')) {
          viewer.flyTo(entity, {
            duration: 2,
            offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-30), 200000),
          })
        } else if (String(entity.id).startsWith('typhoon-')) {
          viewer.flyTo(entity, {
            duration: 2,
            offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-30), 300000),
          })
        } else if (String(entity.id).startsWith('wind-')) {
          viewer.flyTo(entity, {
            duration: 2,
            offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-30), 500000),
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
