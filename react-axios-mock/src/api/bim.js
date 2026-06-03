import request from './index'

// 获取BIM模型列表
export const getBIMModels = () => request.get('/bim/models')

// 获取BIM模型详情
export const getBIMModelDetail = (id) => request.get(`/bim/models/${id}`)

// 创建BIM模型
export const createBIMModel = (data) => request.post('/bim/models', data)

// 更新BIM模型
export const updateBIMModel = (id, data) => request.put(`/bim/models/${id}`, data)

// 删除BIM模型
export const deleteBIMModel = (id) => request.delete(`/bim/models/${id}`)