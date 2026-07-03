import request from './index'

export const getAttendances = (params) => request.get('/attendance', { params })

export const getAttendance = (id) => request.get(`/attendance/${id}`)

export const getMyAttendances = (params) => request.get('/attendance/my', { params })

export const createAttendance = (data) => request.post('/attendance', data)

export const updateAttendance = (id, data) => request.put(`/attendance/${id}`, data)

export const deleteAttendance = (id) => request.delete(`/attendance/${id}`)
