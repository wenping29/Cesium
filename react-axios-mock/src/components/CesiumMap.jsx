import { useEffect, useRef, useState } from 'react'
import {
  Viewer, Cartesian3, Color, NearFarScalar,
  UrlTemplateImageryProvider, WebMercatorTilingScheme, Ion,
} from 'cesium'
import { Box, CircularProgress, Typography } from '@mui/material'
import { getCities } from '../api/cesium'

Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiYjM0OTdiZi0yN2EzLTRkNmItODlkZC1iNGQyZWNjODk1MjkiLCJpZCI6NTc3NjQsInN1YiI6IuaEpOaAkueahOmYv-aWhyIsImlzcyI6Imh0dHBzOi8vaW9uLmNlc2l1bS5jb20iLCJhdWQiOiJhcHAyIiwiaWF0IjoxNzc4ODIxOTk4fQ.HTtyOKV1KT7CNZypQcaqPJYQAYCpaInCh0NwfbctEng'

const TD_TOKEN = 'b4162ac2911ae0392798662d2ad1eda7'

function tdProvider(layer) {
  const layers = { vec: 'vec_c', cva: 'cva_c' }
  return new UrlTemplateImageryProvider({
    url: '',
    tilingScheme: new WebMercatorTilingScheme(),
    maximumLevel: 18,
    getTileUrl(x, y, level) {
      const yInverted = (1 << level) - 1 - y
      return `https://t0.tianditu.gov.cn/DataServer?T=${layers[layer]}&X=${x}&Y=${yInverted}&L=${level}&tk=${TD_TOKEN}`
    },
  })
}

export default function CesiumMap() {
  const containerRef = useRef(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    let viewer

    async function init() {
      try {
        const el = containerRef.current
        if (!el) return

        viewer = new Viewer(el, {
          animation: false,
          timeline: false,
          geocoder: false,
          homeButton: false,
          sceneModePicker: false,
          baseLayerPicker: false,
          navigationHelpButton: false,
          infoBox: false,
          imageryProvider: tdProvider('vec'),
        })

        viewer.imageryLayers.addImageryProvider(tdProvider('cva'))

        viewer.camera.setView({
          destination: Cartesian3.fromDegrees(108, 35, 6000000),
        })

        setLoading(false)

        const res = await getCities()
        if (cancelled || !viewer || viewer.isDestroyed()) return

        const data = res.data
        if (data) {
          data.forEach((city) => {
            viewer.entities.add({
              position: Cartesian3.fromDegrees(city.lng, city.lat),
              point: {
                color: Color.DODGERBLUE,
                pixelSize: 10,
                outlineColor: Color.WHITE,
                outlineWidth: 2,
                scaleByDistance: new NearFarScalar(1.5e6, 1.0, 1.5e7, 0.3),
              },
              label: {
                text: city.name,
                font: '14px sans-serif',
                fillColor: Color.WHITE,
                showBackground: true,
                backgroundColor: Color.BLACK.withAlpha(0.6),
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

  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      {loading && (
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}
    </Box>
  )
}
