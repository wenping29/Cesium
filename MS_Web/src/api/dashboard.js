import request from './index'

export const getDashboardStats = () => request.get('/dashboard/stats')

export const getWorkbenchData = () => request.get('/dashboard/workbench')
