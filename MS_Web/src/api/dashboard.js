import request from './index'

export const getDashboardStats = () => request.get('/dashboard/stats')
