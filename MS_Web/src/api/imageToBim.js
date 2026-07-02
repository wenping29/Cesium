import request from './index'

export const uploadAndConvert = (formData) => request.post('/image-to-bim/convert', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
})

export const getConversionHistory = () => request.get('/image-to-bim/history')

export const getConversionDetail = (id) => request.get(`/image-to-bim/history/${id}`)

export const getConversionResult = (id) => request.get(`/image-to-bim/result/${id}`)
