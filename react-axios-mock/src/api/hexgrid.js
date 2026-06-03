import request from './index'

export const getHexGridCells = () => request.get('/hexgrid/cells')

export const getHexGridGeoJSON = () => request.get('/hexgrid/geojson')
