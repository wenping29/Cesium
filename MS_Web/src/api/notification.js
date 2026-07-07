import request from './index'

export const getNotifications = () => request.get('/notification')

export const getNotification = (id) => request.get(`/notification/${id}`)

export const getUnreadCount = () => request.get('/notification/unread/count')

export const markAsRead = (id) => request.put(`/notification/${id}/mark-read`)

export const markAllAsRead = () => request.put('/notification/mark-all-read')

export const deleteNotification = (id) => request.delete(`/notification/${id}`)

export const createNotification = (data) => request.post('/notification', data)

export const getAllNotifications = (params) => request.get('/notification/all', { params })
