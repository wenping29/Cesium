import request from './index'

export const getHexGridCells = (cellSizeKm = 5) =>
  request.get('/hexgrid/cells', { params: { cellSizeKm } })

export const getHexGridGeoJSON = (cellSizeKm = 5) =>
  request.get('/hexgrid/geojson', { params: { cellSizeKm } })
