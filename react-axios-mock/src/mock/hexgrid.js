import Mock from 'mockjs'
import { generateGoldbergHexGrid, hexGridToGeoJSON } from '../utils/goldberg'

const hexGridCells = generateGoldbergHexGrid(4)
const geoJSON = hexGridToGeoJSON(hexGridCells)

Mock.mock('/api/hexgrid/cells', 'get', () => ({
  code: 200,
  message: 'success',
  data: {
    cells: hexGridCells,
    total: hexGridCells.length,
    pentagons: hexGridCells.filter((c) => c.type === 'pentagon').length,
    hexagons: hexGridCells.filter((c) => c.type === 'hexagon').length,
  },
}))

Mock.mock('/api/hexgrid/geojson', 'get', () => ({
  code: 200,
  message: 'success',
  data: geoJSON,
}))

export { hexGridCells, geoJSON }
