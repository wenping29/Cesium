import request from './index'

export const getDepartments = () => request.get('/department')

export const getAllDepartments = () => request.get('/department/all')

export const getDepartmentById = (id) => request.get(`/department/${id}`)

export const createDepartment = (data) => request.post('/department', data)

export const updateDepartment = (id, data) => request.put(`/department/${id}`, data)

export const deleteDepartment = (id) => request.delete(`/department/${id}`)
