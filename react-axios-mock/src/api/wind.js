import request from './index'

export const getWindData = () => request.get('/wind/current')
