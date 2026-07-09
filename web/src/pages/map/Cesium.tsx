import { useEffect, useRef } from 'react'

function Cesium() {
  const cesiumRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdn.jsdelivr.net/npm/cesium@1.114.0/Build/Cesium/Widgets/widgets.css'
    document.head.appendChild(link)

    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/cesium@1.114.0/Build/Cesium/Cesium.js'
    script.onload = () => {
      if (cesiumRef.current && (window as any).Cesium) {
        const Cesium = (window as any).Cesium
        Cesium.Ion.defaultAccessToken = 'YOUR_CESIUM_ION_TOKEN'
        
        const viewer = new Cesium.Viewer(cesiumRef.current, {
          terrainProvider: Cesium.createWorldTerrain(),
        })
        
        viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(116.404, 39.915, 5000),
        })
      }
    }
    document.body.appendChild(script)
    return () => {
      document.head.removeChild(link)
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div>
      <h2>Cesium 3D地球</h2>
      <p>请在代码中配置Cesium Ion Token</p>
      <div ref={cesiumRef} style={{ width: '100%', height: '600px', border: '1px solid #ccc' }} />
    </div>
  )
}

export default Cesium