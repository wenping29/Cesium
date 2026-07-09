import { useEffect, useRef } from 'react'

function OpenLayer() {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdn.jsdelivr.net/npm/ol@7.4.0/ol.css'
    document.head.appendChild(link)

    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/ol@7.4.0/dist/ol.js'
    script.onload = () => {
      if (mapRef.current && (window as any).ol) {
        const ol = (window as any).ol
        const map = new ol.Map({
          target: mapRef.current,
          layers: [
            new ol.layer.Tile({
              source: new ol.source.OSM(),
            }),
          ],
          view: new ol.View({
            center: ol.proj.fromLonLat([116.404, 39.915]),
            zoom: 12,
          }),
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
      <h2>OpenLayer地图</h2>
      <div ref={mapRef} style={{ width: '100%', height: '500px', border: '1px solid #ccc' }} />
    </div>
  )
}

export default OpenLayer