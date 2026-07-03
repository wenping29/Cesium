import request from './index'

export const getLeaves = (params) => request.get('/leave', { params })

export const getLeave = (id) => request.get(`/leave/${id}`)

export const getMyLeaves = (params) => request.get('/leave/my', { params })

export const createLeave = (data) => request.post('/leave', data)

export const updateLeave = (id, data) => request.put(`/leave/${id}`, data)

export const approveLeave = (id) => request.post(`/leave/${id}/approve`)

export const rejectLeave = (id, remark) => request.post(`/leave/${id}/reject`, remark, {
  headers: { 'Content-Type': 'text/plain' }
})

export const deleteLeave = (id) => request.delete(`/leave/${id}`)
