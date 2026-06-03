import Mock from 'mockjs'

const { Random } = Mock

Random.extend({
  fruit: () => ['apple', 'banana', 'orange', 'grape', 'watermelon'][Random.natural(0, 4)],
})

Mock.mock('/api/users', 'get', () => {
  return {
    code: 200,
    message: 'success',
    data: Array.from({ length: 10 }, (_, i) => ({
      id: Random.guid(),
      name: Random.cname(),
      age: Random.natural(18, 60),
      email: Random.email(),
      fruit: Random.fruit(),
      avatar: Random.image('100x100', Random.color(), '#fff', Random.first()),
      created_at: Random.datetime('yyyy-MM-dd HH:mm:ss'),
    })),
  }
})

Mock.mock('/api/users', 'post', (options) => {
  const body = JSON.parse(options.body)
  return {
    code: 200,
    message: '创建成功',
    data: { id: Random.guid(), ...body, created_at: Random.datetime('yyyy-MM-dd HH:mm:ss') },
  }
})

Mock.mock(/\/api\/users\/\w+/, 'get', (options) => {
  const id = options.url.split('/').pop()
  return {
    code: 200,
    message: 'success',
    data: {
      id,
      name: Random.cname(),
      age: Random.natural(18, 60),
      email: Random.email(),
      avatar: Random.image('100x100', Random.color(), '#fff', Random.first()),
      created_at: Random.datetime('yyyy-MM-dd HH:mm:ss'),
    },
  }
})
