const PHI = (1 + Math.sqrt(5)) / 2

function normalize(v) {
  const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2])
  return [v[0] / len, v[1] / len, v[2] / len]
}

function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]] }

const rawIcosaVertices = [
  [0, 1, PHI], [0, -1, PHI], [0, 1, -PHI], [0, -1, -PHI],
  [1, PHI, 0], [-1, PHI, 0], [1, -PHI, 0], [-1, -PHI, 0],
  [PHI, 0, 1], [-PHI, 0, 1], [PHI, 0, -1], [-PHI, 0, -1],
]

const ICOSA_VERTICES = rawIcosaVertices.map(normalize)

const ICOSA_FACES = [
  [0, 8, 1], [0, 1, 9], [0, 9, 5], [0, 5, 4], [0, 4, 8],
  [1, 8, 6], [1, 6, 7], [1, 7, 9], [9, 7, 11], [9, 11, 5],
  [5, 11, 10], [5, 10, 4], [4, 10, 6], [4, 6, 8], [6, 10, 11],
  [6, 11, 7], [3, 2, 10], [3, 10, 11], [3, 11, 7], [3, 7, 2],
  [2, 6, 10], [2, 7, 6], [2, 3, 8], [2, 8, 4], [2, 4, 10],
  [3, 11, 9], [3, 9, 1], [3, 1, 8], [3, 8, 2], [1, 9, 3],
]

function vec3ToLngLat(v) {
  const lat = Math.asin(v[2]) * (180 / Math.PI)
  const lng = Math.atan2(v[1], v[0]) * (180 / Math.PI)
  return { lng, lat }
}

function barycentricPoint(a, b, c, i, j, nu) {
  const u = i / nu
  const v = j / nu
  const w = 1 - u - v
  const p = normalize([
    w * a[0] + u * b[0] + v * c[0],
    w * a[1] + u * b[1] + v * c[1],
    w * a[2] + u * b[2] + v * c[2],
  ])
  return p
}

function triangleCenter(a, b, c) {
  const cx = (a[0] + b[0] + c[0]) / 3
  const cy = (a[1] + b[1] + c[1]) / 3
  const cz = (a[2] + b[2] + c[2]) / 3
  return normalize([cx, cy, cz])
}

function vec3Key(v) {
  return `${v[0].toFixed(6)},${v[1].toFixed(6)},${v[2].toFixed(6)}`
}

function generateGoldbergHexGrid(frequency = 4) {
  const nu = frequency
  let cellId = 0

  const faceTriangles = ICOSA_FACES.map((face) => {
    const [ai, bi, ci] = face
    const a = ICOSA_VERTICES[ai]
    const b = ICOSA_VERTICES[bi]
    const c = ICOSA_VERTICES[ci]
    const triangles = []

    for (let i = 0; i <= nu; i++) {
      for (let j = 0; j <= nu - i; j++) {
        const p1 = barycentricPoint(a, b, c, i, j, nu)
        const p2 = barycentricPoint(a, b, c, i + 1, j, nu)
        const p3 = barycentricPoint(a, b, c, i, j + 1, nu)
        const p4 = barycentricPoint(a, b, c, i + 1, j + 1, nu)

        if (i + j < nu) {
          triangles.push([p1, p2, p3])
        }
        if (i > 0 || j > 0) {
          if (i + j < nu) {
            triangles.push([p2, p4, p3])
          }
        }
      }
    }

    return { faceIdx: face, triangles }
  })

  const allSubTriangles = faceTriangles.flatMap((ft) =>
    ft.triangles.map((tri) => {
      const center = triangleCenter(tri[0], tri[1], tri[2])
      return { vertices: tri, center }
    })
  )

  const vertexToTriangles = {}
  allSubTriangles.forEach((tri, idx) => {
    tri.vertices.forEach((v) => {
      const key = vec3Key(v)
      if (!vertexToTriangles[key]) vertexToTriangles[key] = []
      vertexToTriangles[key].push(idx)
    })
  })

  const seenCentroids = new Set()
  const cells = []

  const isIcosaVertex = (v) => {
    const key = vec3Key(v)
    return ICOSA_VERTICES.some((iv) => vec3Key(iv) === key)
  }

  Object.entries(vertexToTriangles).forEach(([vKey, triIndices]) => {
    const v = vKey.split(',').map(Number)
    const uniqueCentroids = []
    const seen = new Set()

    triIndices.forEach((idx) => {
      const cKey = vec3Key(allSubTriangles[idx].center)
      if (!seen.has(cKey)) {
        seen.add(cKey)
        uniqueCentroids.push(allSubTriangles[idx].center)
      }
    })

    if (uniqueCentroids.length < 3) return

    const centroid = triangleCenter(...uniqueCentroids)
    const cKey = vec3Key(centroid)
    if (seenCentroids.has(cKey)) return
    seenCentroids.add(cKey)

    const sortedCents = sortAroundPoint(uniqueCentroids, centroid)
    const cellVertices = sortedCents.map((c) => vec3ToLngLat(c))
    const centerLngLat = vec3ToLngLat(centroid)
    const centLngLat = vec3ToLngLat(v)

    const isPentagon = isIcosaVertex(v)
    const vertsAt = uniqueCentroids.length

    cells.push({
      id: `cell_${cellId++}`,
      center: centerLngLat,
      centroid: centLngLat,
      vertices: cellVertices,
      type: isPentagon ? 'pentagon' : 'hexagon',
      numSides: vertsAt,
      properties: {
        name: `${isPentagon ? 'Pentagon' : 'Hexagon'} ${cellId}`,
        elevation: Math.random() * 500 + 100,
        population: Math.floor(Math.random() * 10000),
        region: '',
      },
    })
  })

  return cells
}

function sortAroundPoint(points, center) {
  const angles = points.map((p) => {
    const dir = sub(p, center)
    const d = normalize(dir)
    let angle = Math.acos(Math.max(-1, Math.min(1, d[0])))
    if (d[1] < 0) angle = 2 * Math.PI - angle
    return { point: p, angle }
  })
  angles.sort((a, b) => a.angle - b.angle)
  return angles.map((a) => a.point)
}

function hexGridToGeoJSON(cells) {
  return {
    type: 'FeatureCollection',
    features: cells.map((cell) => ({
      type: 'Feature',
      id: cell.id,
      properties: {
        type: cell.type,
        numSides: cell.numSides,
        name: cell.properties.name,
        elevation: cell.properties.elevation,
        population: cell.properties.population,
        region: cell.properties.region,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [...cell.vertices.map((v) => [v.lng, v.lat]), [cell.vertices[0].lng, cell.vertices[0].lat]],
        ],
      },
    })),
  }
}

export { generateGoldbergHexGrid, hexGridToGeoJSON }
export default generateGoldbergHexGrid
