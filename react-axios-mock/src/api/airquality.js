import request from './index'

export const getAirQuality = () => request.get('/airquality/current')
