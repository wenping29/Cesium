import { useEffect, useRef } from 'react'
import { Viewer, Cartesian3, Color, NearFarScalar, Entity } from 'cesium'
import { getCities } from '../api/cesium'

export default function CesiumMap() {
  const containerRef = useRef(null)
  const viewerRef = useRef(null)

  useEffect(() => {
    const viewer = new Viewer(containerRef.current, {
      animation: false,
      timeline: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      baseLayerPicker: false,
      navigationHelpButton: false,
      infoBox: false,
      terrain: false,
    })
    viewerRef.current = viewer

    viewer.camera.setView({
      destination: Cartesian3.fromDegrees(108, 35, 6000000),
    })

    getCities().then((res) => {
      const data = res.data
      if (!data) return
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
    })

    return () => {
      viewer.destroy()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
    />
  )
}
