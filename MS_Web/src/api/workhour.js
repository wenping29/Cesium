import request from './index'

export const getWorkHours = (params) => request.get('/workhour', { params })

export const getWorkHour = (id) => request.get(`/workhour/${id}`)

export const getMyWorkHours = (params) => request.get('/workhour/my', { params })

export const createWorkHour = (data) => request.post('/workhour', data)

export const updateWorkHour = (id, data) => request.put(`/workhour/${id}`, data)

export const deleteWorkHour = (id) => request.delete(`/workhour/${id}`)
