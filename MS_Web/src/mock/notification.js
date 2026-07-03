import Mock from 'mockjs'

const { Random } = Mock

let notifications = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  title: Random.ctitle(8, 20),
  content: Random.csentence(10, 60),
  detail: Random.cparagraph(2, 5),
  type: Random.pick(['system', 'task', 'message']),
  icon: Random.pick(['SystemUpdate', 'Assignment', 'Event', 'PersonAdd', 'Chat']),
  color: Random.pick(['primary', 'warning', 'info', 'success', 'error']),
  sender: Random.cname(),
  date: Random.datetime('yyyy-MM-dd HH:mm:ss'),
  read: Random.boolean()
}))

Mock.mock('/api/notification', 'get', () => [...notifications])

Mock.mock('/api/notification/unread/count', 'get', () => ({
  count: notifications.filter(n => !n.read).length
}))

Mock.mock(/\/api\/notification\/all/, 'get', (options) => {
  const url = new URL(options.url, 'http://localhost')
  const page = parseInt(url.searchParams.get('page') || '1', 10)
  const size = parseInt(url.searchParams.get('size') || '20', 10)
  const start = (page - 1) * size
  const paged = notifications.slice(start, start + size)
  return { data: paged, total: notifications.length }
})

Mock.mock('/api/notification', 'post', (options) => {
  const body = JSON.parse(options.body)
  const notification = {
    id: notifications.length + 1,
    ...body,
    icon: body.type === 'system' ? 'SystemUpdate' : body.type === 'task' ? 'Assignment' : 'Chat',
    color: body.type === 'system' ? 'info' : body.type === 'task' ? 'warning' : 'success',
    sender: 'Admin',
    date: body.sendTime || Random.datetime('yyyy-MM-dd HH:mm:ss'),
    read: false,
    detail: body.content
  }
  delete notification.sendTime
  notifications.unshift(notification)
  return { code: 200, message: 'success', data: notification }
})

Mock.mock(/\/api\/notification\/\d+\/mark-read/, 'put', (options) => {
  const id = parseInt(options.url.match(/\/api\/notification\/(\d+)\/mark-read/)[1], 10)
  const found = notifications.find(n => n.id === id)
  if (found) found.read = true
  return { code: 200, message: 'success' }
})

Mock.mock('/api/notification/mark-all-read', 'put', () => {
  notifications.forEach(n => { n.read = true })
  return { code: 200, message: 'success' }
})

Mock.mock(/\/api\/notification\/\d+/, 'delete', (options) => {
  const id = parseInt(options.url.match(/\/api\/notification\/(\d+)/)[1], 10)
  notifications = notifications.filter(n => n.id !== id)
  return { code: 200, message: 'success' }
})
