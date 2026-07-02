const KM_PER_DEG = 111.32

function hexVertex(lng, lat, radius, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180
  return {
    lng: lng + (radius * Math.cos(rad)) / (KM_PER_DEG * Math.cos((lat * Math.PI) / 180)),
    lat: lat + (radius * Math.sin(rad)) / KM_PER_DEG,
  }
}

function hexVertices(centerLng, centerLat, radius) {
  const angles = [90, 30, 330, 270, 210, 150]
  return angles.map((a) => hexVertex(centerLng, centerLat, radius, a))
}

export function generateHexGrid(cellSizeKm = 5) {
  const radius = cellSizeKm / KM_PER_DEG
  const hexH = 1.5 * radius
  const hexW = Math.sqrt(3) * radius

  const minLat = 15, maxLat = 55, minLng = 70, maxLng = 140

  const cells = []
  let id = 0

  for (let lat = minLat + radius; lat <= maxLat; lat += hexH) {
    const row = Math.round((lat - minLat) / hexH)
    const offset = row % 2 === 0 ? 0 : hexW / 2

    for (let lng = minLng + offset + hexW / 2; lng <= maxLng; lng += hexW) {
      const centerLat = Math.min(lat, maxLat)
      const centerLng = Math.min(lng, maxLng)
      const vertices = hexVertices(centerLng, centerLat, radius)
      cells.push({ id: `hex-${id++}`, vertices })
    }
  }

  return cells
}
