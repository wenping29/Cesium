import Mock from 'mockjs'
import { generateLocalHexGrid, hexGridToGeoJSON } from '../utils/goldberg'

const cache = {}

function getOrGenerate(cellSizeKm) {
  const key = String(cellSizeKm)
  if (!cache[key]) {
    cache[key] = generateLocalHexGrid(35, 108, cellSizeKm, 15)
  }
  return cache[key]
}

Mock.mock(/\/api\/hexgrid\/cells(?:\?.*)?$/, 'get', (options) => {
  const url = new URL(options.url, 'http://localhost')
  const cellSizeKm = parseFloat(url.searchParams.get('cellSizeKm') || '5')
  const cells = getOrGenerate(cellSizeKm)
  return {
    code: 200,
    message: 'success',
    data: {
      cells,
      total: cells.length,
      pentagons: 0,
      hexagons: cells.length,
      cellSizeKm,
    },
  }
})

Mock.mock(/\/api\/hexgrid\/geojson(?:\?.*)?$/, 'get', (options) => {
  const url = new URL(options.url, 'http://localhost')
  const cellSizeKm = parseFloat(url.searchParams.get('cellSizeKm') || '5')
  const cells = getOrGenerate(cellSizeKm)
  return {
    code: 200,
    message: 'success',
    data: hexGridToGeoJSON(cells),
  }
})
