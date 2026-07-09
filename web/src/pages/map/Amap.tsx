import { useEffect, useRef } from 'react'

function Amap() {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://webapi.amap.com/maps?v=2.0&key=YOUR_AMAP_KEY'
    script.onload = () => {
      if (mapRef.current && (window as any).AMap) {
        const map = new (window as any).AMap.Map(mapRef.current, {
          zoom: 12,
          center: [116.397428, 39.90923],
        })
      }
    }
    document.body.appendChild(script)
    return () => document.body.removeChild(script)
  }, [])

  return (
    <div>
      <h2>高德地图</h2>
      <p>请在代码中配置高德地图API Key</p>
      <div ref={mapRef} style={{ width: '100%', height: '500px', border: '1px solid #ccc' }} />
    </div>
  )
}

export default Amap