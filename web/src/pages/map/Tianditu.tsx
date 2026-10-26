import { useEffect, useRef } from 'react'

const tianditu_key = 'b4162ac2911ae0392798662d2ad1eda7'

function Tianditu() {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = `https://api.tianditu.gov.cn/api?v=4.0&tk=${tianditu_key}`
    script.onload = () => {
      if (mapRef.current && (window as any).T) {
        const T = (window as any).T
        const map = new T.Map(mapRef.current)
        map.centerAndZoom(new T.LngLat(116.404, 39.915), 12)
        map.addControl(new T.Control.Zoom())
      }
    }
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div>
      <h2>天地图</h2>
      <div ref={mapRef} style={{ width: '100%', height: '500px', border: '1px solid #ccc' }} />
    </div>
  )
}

export default Tianditu
