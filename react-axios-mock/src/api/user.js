import request from './index'

export const getUsers = () => request.get('/users')

export const getUserById = (id) => request.get(`/users/${id}`)

export const createUser = (data) => request.post('/users', data)
