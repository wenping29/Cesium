import request from './index'

export const getVisitorLogs = (params) => request.get('/visitors', { params })

export const recordVisit = (data) => request.post('/visitors', data)
