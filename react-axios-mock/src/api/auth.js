import request from './index'

export const login = (data) => request.post('/auth/login', data)

export const logout = () => request.post('/auth/logout')

export const getMe = () => request.get('/auth/me')
