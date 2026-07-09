import Mock from 'mockjs'

const { Random } = Mock

const statusList = ['active', 'inactive', 'locked']

const users: any[] = Array.from({ length: 35 }, (_, i) => ({
  id: i + 1,
  username: Random.string(4, 10),
  name: Random.cname(),
  email: Random.email(),
  phone: /^1[3-9]\d{9}$/.exec(Random.string('number', 11))?.[0] || '13800138000',
  status: statusList[Random.integer(0, 2)],
  createTime: Random.datetime('yyyy-MM-dd HH:mm:ss'),
}))

Mock.mock('/api/system/user/list', 'get', (options: any) => {
  const url = new URL(options.url, 'http://localhost')
  const page = parseInt(url.searchParams.get('page') || '1')
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10')
  const username = url.searchParams.get('username') || ''
  const email = url.searchParams.get('email') || ''
  const status = url.searchParams.get('status') || ''

  let filtered = [...users]
  if (username) filtered = filtered.filter((u) => u.username.includes(username) || u.name.includes(username))
  if (email) filtered = filtered.filter((u) => u.email.includes(email))
  if (status) filtered = filtered.filter((u) => u.status === status)

  const total = filtered.length
  const start = (page - 1) * pageSize
  const list = filtered.slice(start, start + pageSize)

  return {
    code: 0,
    message: 'success',
    data: { list, total },
  }
})

Mock.mock('/api/system/user', 'post', (options: any) => {
  const body = JSON.parse(options.body)
  const newUser = {
    id: users.length + 1,
    username: body.username,
    name: body.name || body.username,
    email: body.email,
    phone: body.phone || '',
    status: body.status || 'active',
    createTime: Random.datetime('yyyy-MM-dd HH:mm:ss'),
  }
  users.unshift(newUser)
  return {
    code: 0,
    message: 'success',
    data: newUser,
  }
})
