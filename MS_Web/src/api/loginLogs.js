import request from './index'

export const getLoginLogs = (params) => request.get('/loginlogs', { params })

export const getMyLoginLogs = (params) => request.get('/loginlogs/my', { params })
