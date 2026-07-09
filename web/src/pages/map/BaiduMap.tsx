import { useEffect, useRef } from 'react'

function BaiduMap() {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://api.map.baidu.com/api?v=3.0&ak=YOUR_BAIDU_MAP_KEY'
    script.onload = () => {
      if (mapRef.current && (window as any).BMap) {
        const map = new (window as any).BMap.Map(mapRef.current)
        const point = new (window as any).BMap.Point(116.404, 39.915)
        map.centerAndZoom(point, 12)
        map.enableScrollWheelZoom(true)
      }
    }
    document.body.appendChild(script)
    return () => document.body.removeChild(script)
  }, [])

  return (
    <div>
      <h2>百度地图</h2>
      <p>请在代码中配置百度地图API Key</p>
      <div ref={mapRef} style={{ width: '100%', height: '500px', border: '1px solid #ccc' }} />
    </div>
  )
}

export default BaiduMap