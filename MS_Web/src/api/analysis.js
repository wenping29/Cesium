import request from './index'

export const getAnalysis = (params) => request.get('/analysis', { params })
