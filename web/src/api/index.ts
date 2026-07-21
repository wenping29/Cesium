import request from './request'

export function login(data: { username: string; password: string }) {
  return request.post('/api/auth/login', data) as Promise<any>
}

export function register(data: { username: string; email: string; password: string }) {
  return request.post('/api/auth/register', data) as Promise<any>
}

export function fetchMenus() {
  return request.get('/api/menu') as Promise<any>
}

export function getUserList(params: Record<string, string | number>) {
  return request.get('/api/system/user/list', { params }) as Promise<any>
}

export function createUser(data: Record<string, any>) {
  return request.post('/api/system/user', data) as Promise<any>
}
