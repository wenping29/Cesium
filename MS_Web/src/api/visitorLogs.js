import request from './index'

export const getVisitorLogs = (params) => request.get('/visitors', { params })
