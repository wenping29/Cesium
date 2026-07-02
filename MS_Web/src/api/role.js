import request from './index'

export const getRoles = () => request.get('/role')

export const getRoleById = (id) => request.get(`/role/${id}`)

export const createRole = (data) => request.post('/role', data)

export const updateRole = (id, data) => request.put(`/role/${id}`, data)

export const deleteRole = (id) => request.delete(`/role/${id}`)
