import request from './index'

export const getAnnualLeaves = (params) => request.get('/annualleave', { params })

export const getAnnualLeave = (id) => request.get(`/annualleave/${id}`)

export const getMyAnnualLeave = (params) => request.get('/annualleave/my', { params })

export const getMyAnnualLeaves = (params) => request.get('/annualleave/my', { params })

export const createAnnualLeave = (data) => request.post('/annualleave', data)

export const updateAnnualLeave = (id, data) => request.put(`/annualleave/${id}`, data)

export const deleteAnnualLeave = (id) => request.delete(`/annualleave/${id}`)
