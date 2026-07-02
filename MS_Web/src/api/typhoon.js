import request from './index'

export const getCurrentTyphoon = () => request.get('/typhoon/current')
export const getHistoricalTyphoons = () => request.get('/typhoon/historical')
