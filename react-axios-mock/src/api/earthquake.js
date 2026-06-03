import request from './index'

export const getEarthquakes = (params) => request.get('/earthquake/historical', { params })
