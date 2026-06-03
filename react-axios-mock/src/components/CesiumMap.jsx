import { useEffect, useRef, useState } from 'react'
import * as Cesium from 'cesium'
import { Box, CircularProgress, Typography } from '@mui/material'
import { getCities } from '../api/cesium'

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiYjM0OTdiZi0yN2EzLTRkNmItODlkZC1iNGQyZWNjODk1MjkiLCJpZCI6NTc3NjQsInN1YiI6IuaEpOaAkueahOmYv-aWhyIsImlzcyI6Imh0dHBzOi8vaW9uLmNlc2l1bS5jb20iLCJhdWQiOiJhcHAyIiwiaWF0IjoxNzc4ODIxOTk4fQ.HTtyOKV1KT7CNZypQcaqPJYQAYCpaInCh0NwfbctEng'

Cesium.Resource.supportsImageBitmapOptions = function () {
  return Promise.resolve(false)
}

// 天地图 Token (需要在 .env 文件中配置 VITE_TIANDITU_TOKEN)
const TIANDITU_TOKEN = import.meta.env.VITE_TIANDITU_TOKEN || ''

// 底图配置
const BASEMAP_PROVIDERS = {
  // 天地图矢量底图
  tianditu_vec: {
    base: new Cesium.WebMapTileServiceImageryProvider({
      url: `/tianditu/vec_w/wmts?tk=${TIANDITU_TOKEN}`,
      layer: 'vec',
      style: 'default',
      format: 'tiles',
      tileMatrixSetID: 'w',
      maximumLevel: 18,
    }),
    annotation: new Cesium.WebMapTileServiceImageryProvider({
      url: `/tianditu/cva_w/wmts?tk=${TIANDITU_TOKEN}`,
      layer: 'cva',
      style: 'default',
      format: 'tiles',
      tileMatrixSetID: 'w',
      maximumLevel: 18,
    })
  },
  // 天地图卫星底图
  tianditu_img: {
    base: new Cesium.WebMapTileServiceImageryProvider({
      url: `/tianditu/img_w/wmts?tk=${TIANDITU_TOKEN}`,
      layer: 'img',
      style: 'default',
      format: 'tiles',
      tileMatrixSetID: 'w',
      maximumLevel: 18,
    }),
    annotation: new Cesium.WebMapTileServiceImageryProvider({
      url: `/tianditu/cia_w/wmts?tk=${TIANDITU_TOKEN}`,
      layer: 'cia',
      style: 'default',
      format: 'tiles',
      tileMatrixSetID: 'w',
      maximumLevel: 18,
    })
  },
  // 天地图地形底图
  tianditu_ter: {
    base: new Cesium.WebMapTileServiceImageryProvider({
      url: `/tianditu/ter_w/wmts?tk=${TIANDITU_TOKEN}`,
      layer: 'ter',
      style: 'default',
      format: 'tiles',
      tileMatrixSetID: 'w',
      maximumLevel: 14,
    }),
    annotation: new Cesium.WebMapTileServiceImageryProvider({
      url: `/tianditu/cta_w/wmts?tk=${TIANDITU_TOKEN}`,
      layer: 'cta',
      style: 'default',
      format: 'tiles',
      tileMatrixSetID: 'w',
      maximumLevel: 14,
    })
  },
  // 高德街道图
  amap_vec: {
    base: new Cesium.UrlTemplateImageryProvider({
      url: 'https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
      minimumLevel: 1,
      maximumLevel: 18,
    })
  },
  // 高德卫星图
  amap_img: {
    base: new Cesium.UrlTemplateImageryProvider({
      url: 'https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
      minimumLevel: 1,
      maximumLevel: 18,
    })
  },
  // 高德交通图
  amap_traffic: {
    base: new Cesium.UrlTemplateImageryProvider({
      url: 'https://tm.amap.com/trafficengine/mapabc/traffictile?v=1.0&t=1&x={x}&y={y}&z={z}',
      minimumLevel: 1,
      maximumLevel: 18,
    })
  }
}

export default function CesiumMap({ currentBasemap = 'tianditu_vec', bimModels = [], onBimLoad = null }) {
  const containerRef = useRef(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const viewerRef = useRef(null)
  const bimEntitiesRef = useRef({})

  useEffect(() => {
    let cancelled = false
    let viewer

    async function init() {
      try {
        const el = containerRef.current
        if (!el) return

        viewer = new Cesium.Viewer(el, {
          animation: false,
          timeline: false,
          geocoder: false,
          homeButton: false,
          sceneModePicker: false,
          baseLayerPicker: false,
          navigationHelpButton: false,
          infoBox: false,
        })

        viewerRef.current = viewer

        // 移除默认底图
        viewer.imageryLayers.removeAll()

        // 添加默认底图
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

  // 切换底图
  useEffect(() => {
    if (viewerRef.current && !viewerRef.current.isDestroyed()) {
      changeBasemap(currentBasemap)
    }
  }, [currentBasemap])

  // 添加底图图层
  const addBasemapLayer = (viewer, basemapId) => {
    const provider = BASEMAP_PROVIDERS[basemapId]
    if (!provider) return

    viewer.imageryLayers.removeAll()

    if (provider.base) {
      viewer.imageryLayers.addImageryProvider(provider.base)
    }

    if (provider.annotation) {
      viewer.imageryLayers.addImageryProvider(provider.annotation)
    }
  }

  // 切换底图
  const changeBasemap = (basemapId) => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed()) return

    addBasemapLayer(viewer, basemapId)
  }

  // 加载BIM模型
  const loadBIMModel = async (viewer, bimModel) => {
    try {
      // 创建BIM模型的位置
      const position = Cesium.Cartesian3.fromDegrees(
        bimModel.position.lng,
        bimModel.position.lat,
        bimModel.position.height
      )

      // 创建BIM模型的实体（使用简单的几何体模拟）
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
        position: position,
        point: {
          pixelSize: 15,
          color: Cesium.Color.fromCssColorString(bimModel.status === 'active' ? '#00ff00' : '#ffaa00'),
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2,
          heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
        },
        label: {
          text: bimModel.name,
          font: '14px sans-serif',
          fillColor: Cesium.Color.WHITE,
          showBackground: true,
          backgroundColor: Cesium.Color.BLACK.withAlpha(0.7),
          pixelOffset: { x: 0, y: -20 },
          heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
        },
        // 使用盒子模拟建筑模型
        box: {
          dimensions: new Cesium.Cartesian3(100, 100, 50),
          material: Cesium.Color.fromCssColorString(
            bimModel.type === 'building' ? '#4a90e2' :
            bimModel.type === 'bridge' ? '#f5a623' :
            bimModel.type === 'tunnel' ? '#7ed321' :
            bimModel.type === 'facility' ? '#bd10e0' :
            bimModel.type === 'pipeline' ? '#50e3c2' : '#9b9b9b'
          ).withAlpha(0.8),
          outline: true,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2,
          heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
        }
      })

      bimEntitiesRef.current[bimModel.id] = entity

      // 触发BIM加载完成回调
      if (onBimLoad) {
        onBimLoad(bimModel.id, true)
      }
    } catch (error) {
      console.error('Failed to load BIM model:', error)
      if (onBimLoad) {
        onBimLoad(bimModel.id, false, error.message)
      }
    }
  }

  // 移除BIM模型
  const removeBIMModel = (viewer, bimModelId) => {
    const entity = bimEntitiesRef.current[bimModelId]
    if (entity) {
      viewer.entities.remove(entity)
      delete bimEntitiesRef.current[bimModelId]
    }
  }

  // 清除所有BIM模型
  const clearAllBIMModels = (viewer) => {
    Object.keys(bimEntitiesRef.current).forEach(id => {
      const entity = bimEntitiesRef.current[id]
      if (entity) {
        viewer.entities.remove(entity)
      }
    })
    bimEntitiesRef.current = {}
  }

  // 处理BIM模型列表变化
  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed()) return

    // 清除所有现有的BIM模型
    clearAllBIMModels(viewer)

    // 加载新的BIM模型
    bimModels.forEach(bimModel => {
      loadBIMModel(viewer, bimModel)
    })
  }, [bimModels])

  // 添加BIM模型点击事件
  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed()) return

    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    handler.setInputAction((click) => {
      const pickedObject = viewer.scene.pick(click.position)
      if (Cesium.defined(pickedObject) && pickedObject.id instanceof Cesium.Entity) {
        const entity = pickedObject.id
        if (entity.id && bimEntitiesRef.current[entity.id]) {
          // 飞行到BIM模型位置
          viewer.flyTo(entity, {
            duration: 2,
            offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-45), 500)
          })
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    return () => {
      handler.destroy()
    }
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
