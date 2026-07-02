import request from './index'

export const getMenus = () => request.get('/menu')

export const getAllMenus = () => request.get('/menu/all')

export const getMenuById = (id) => request.get(`/menu/${id}`)

export const createMenu = (data) => request.post('/menu', data)

export const updateMenu = (id, data) => request.put(`/menu/${id}`, data)

export const deleteMenu = (id) => request.delete(`/menu/${id}`)
