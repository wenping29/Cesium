import request from './index'

export const getCities = () => request.get('/cities')

export const getLandmarks = () => request.get('/landmarks')

export const getCesiumToken = () => request.get('/cesium/token')
