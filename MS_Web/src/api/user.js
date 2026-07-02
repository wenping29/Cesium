import request from './index'

export const getUsers = () => request.get('/user/all')

export const getUserById = (id) => request.get(`/users/${id}`)

export const createUser = (data) => request.post('/users', data)

export const addRole = (userId, roleName) => request.post(`/user/${userId}/roles/${roleName}`)

export const removeRole = (userId, roleName) => request.delete(`/user/${userId}/roles/${roleName}`)
