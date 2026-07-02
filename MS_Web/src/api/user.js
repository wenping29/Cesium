import request from './index'

export const getUsers = () => request.get('/user')

export const getUserById = (id) => request.get(`/user/${id}`)

export const createUser = (data) => request.post('/user', data)

export const updateUser = (id, data) => request.put(`/user/${id}`, data)

export const deleteUser = (id) => request.delete(`/user/${id}`)

export const addRole = (userId, roleName) => request.post(`/user/${userId}/roles/${roleName}`)

export const removeRole = (userId, roleName) => request.delete(`/user/${userId}/roles/${roleName}`)
