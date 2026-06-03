import request from './index'

export const getLayers = () => request.get('/layers')

export const createLayer = (data) => request.post('/layers', data)

export const updateLayer = (id, data) => request.put(`/layers/${id}`, data)

export const deleteLayer = (id) => request.delete(`/layers/${id}`)
